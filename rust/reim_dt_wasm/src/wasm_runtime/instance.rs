use std::{sync::{Arc, Mutex}, future::Future, pin::Pin};

use reim_dt::OnReceiveFn;
use wasmtime::{
    AsContextMut, Config, Engine, Extern, Instance, Memory, MemoryType, Module, Store, Val,
};

use super::imports::create_imports;
use crate::{utils::index_of_array, error::WrapperError};

pub struct WasmInstance {
    instance: Instance,
    pub store: Store<State>,
    pub module: Module,
    pub memory: Arc<Mutex<Memory>>,
}

pub enum WasmModule {
    Bytes(Vec<u8>),
    Wat(String),
    Path(String),
}

#[derive(Default)]
pub struct InvokeState {
    pub result: Option<Vec<u8>>,
    pub error: Option<String>,
}

pub struct State {
    pub input_buffer: Vec<u8>,
    pub on_receive: OnReceiveFn,
    pub send_result: Vec<u8>,
}

impl State {
    pub fn new() -> Self {
        Self {
            input_buffer: Vec::new(),
            on_receive: Box::new(|_| Box::pin(async { Vec::new() })),
            send_result: Vec::new(),
        }
    }
}

impl WasmInstance {
    pub async fn new(wasm_module: &WasmModule, shared_state: State) -> Result<Self, WrapperError> {
        let mut config = Config::new();
        config.async_support(true);

        let engine =
            Engine::new(&config).map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;
        let mut linker = wasmtime::Linker::new(&engine);

        let mut store = Store::new(&engine, shared_state);
        let module_result = match wasm_module {
            WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes),
            WasmModule::Wat(ref wat) => Module::new(&engine, wat),
            WasmModule::Path(ref path) => Module::from_file(&engine, path),
        };

        let module = module_result.map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;
        let module_bytes = module
            .serialize()
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

        let memory = WasmInstance::create_memory(module_bytes.as_ref(), &mut store)?;

        let memory = Arc::new(Mutex::new(memory));

        create_imports(&mut linker, &memory)?;

        let instance = linker
            .instantiate_async(store.as_context_mut(), &module)
            .await
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

        Ok(Self {
            module,
            instance,
            store,
            memory,
        })
    }

    pub async fn call_export(
        &mut self,
        name: &str,
        params: &[Val],
        results: &mut [Val],
    ) -> Result<(), WrapperError> {
        let export = self.instance.get_export(self.store.as_context_mut(), name);

        if export.is_none() {
            return Err(WrapperError::WasmRuntimeError(format!(
                "Export {} not found",
                name
            )));
        }

        match export.unwrap() {
            Extern::Func(func) => {
                func.call_async(self.store.as_context_mut(), params, results)
                    .await
                    .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

                Ok(())
            }
            _ => panic!("Export is not a function"),
        }
    }

    fn create_memory<T>(module_bytes: &[u8], store: &mut Store<T>) -> Result<Memory, WrapperError> {
        const ENV_MEMORY_IMPORTS_SIGNATURE: [u8; 11] = [
            0x65, 0x6e, 0x76, 0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02,
        ];

        let sig_idx = index_of_array(module_bytes, &ENV_MEMORY_IMPORTS_SIGNATURE);

        if sig_idx.is_none() {
            return Err(WrapperError::ModuleReadError(
                r#"Unable to find Wasm memory import section.
            Modules must import memory from the "env" module's
            "memory" field like so:
            (import "env" "memory" (memory (;0;) #))"#
                    .to_string(),
            ));
        }

        let memory_initial_limits =
            module_bytes[sig_idx.unwrap() + ENV_MEMORY_IMPORTS_SIGNATURE.len() + 1];
        let memory_type = MemoryType::new(memory_initial_limits.into(), Option::None);

        Memory::new(store.as_context_mut(), memory_type)
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))
    }
}
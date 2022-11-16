use std::sync::Arc;

use async_trait::async_trait;
use reim_dt::DtInstance;
use reim_dt::Receiver;
use wasmtime::AsContextMut;
use wasmtime::Val;

use crate::error::WrapperError;
use crate::wasm_runtime::imports::read_from_memory;
use crate::wasm_runtime::instance::State;
use crate::wasm_runtime::instance::WasmInstance;
use crate::wasm_runtime::instance::WasmModule;

pub struct DtWasmInstance {
    wasm_instance: WasmInstance,
} 

impl DtWasmInstance {
    pub async fn new(wasm_module: WasmModule) -> DtWasmInstance {
        let state = State::new();

        Self {
            wasm_instance: WasmInstance::new(&wasm_module, state).await.unwrap()
        }
    }
}

#[async_trait]
impl DtInstance for DtWasmInstance {
    async fn send(&mut self, buffer: &[u8], on_receive: Arc<dyn Receiver>) -> Vec<u8>  {
        let buffer_len = buffer.len() as i32;

        let params = &[
            Val::I32(buffer_len),
        ];

        let state = (self.wasm_instance.store).data_mut();
        state.input_buffer = buffer.to_vec();
        state.receiver = Some(on_receive);

        let mut result: [Val; 1] = [Val::I32(0)];

        self.wasm_instance
            .call_export("_dt_receive", params, &mut result)
            .await
            .map_err(|e| WrapperError::InvokeError(e.to_string())).unwrap();

        let len_and_result_ptr = result[0].unwrap_i32();

        let memory = self.wasm_instance.memory.lock().unwrap();
        let (memory_buffer, _) = memory.data_and_store_mut(self.wasm_instance.store.as_context_mut());

        let len_buffer =
            read_from_memory(memory_buffer, len_and_result_ptr as usize, buffer_len as usize);

        let len = u32::from_le_bytes(len_buffer.try_into().unwrap());

        let result = read_from_memory(memory_buffer, len_and_result_ptr as usize + 4, len as usize);

        result
    }
}

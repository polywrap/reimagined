use std::sync::{Arc, Mutex};

use wasmtime::{AsContextMut, Caller, Linker, Memory};

use crate::{error::WrapperError, wasm_runtime::instance::State};

pub fn read_from_memory(buffer: &mut [u8], ptr: usize, len: usize) -> Vec<u8> {
    buffer[ptr..(ptr + len)].to_vec()
}

fn write_to_memory(buffer: &mut [u8], ptr: usize, data: &[u8]) {
    buffer[ptr..(ptr + data.len())].copy_from_slice(data);
}

pub fn create_imports(
    linker: &mut Linker<State>,
    arc_memory: &Arc<Mutex<Memory>>,
) -> Result<(), WrapperError> {
    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap(
            "wrap",
            "__dt_fill_input_buffer",
            move |mut caller: Caller<'_, State>, buffer_ptr: u32| {
                let memory = memory.lock().unwrap();
                let (memory_buffer, state) = memory.data_and_store_mut(caller.as_context_mut());

                write_to_memory(memory_buffer, buffer_ptr as usize, &state.input_buffer);

                Ok(())
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap2_async(
            "wrap",
            "__send",
            move |mut caller: Caller<'_, State>,
                  buffer_ptr: u32,
                  buffer_len: u32| {
                let memory = memory.lock().unwrap();
                let async_memory = Arc::new(tokio::sync::Mutex::new(*memory));

                let a = Box::new(async move {
                    let memory = async_memory.lock().await;
                    let (memory_buffer, state) = memory.data_and_store_mut(caller.as_context_mut());
                    let buffer =
                        read_from_memory(memory_buffer, buffer_ptr as usize, buffer_len as usize);

                    let result = (state.on_receive)(buffer).await;

                    let result_len = result.len() as u32;

                    state.send_result = result;

                    result_len
                });

                a
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap(
            "wrap",
            "__dt_fill_send_result",
            move |mut caller: Caller<'_, State>, buffer_ptr: u32| {
                let memory = memory.lock().unwrap();
                let (memory_buffer, state) = memory.data_and_store_mut(caller.as_context_mut());

                write_to_memory(memory_buffer, buffer_ptr as usize, &state.send_result);

                Ok(())
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    linker
        .define("env", "memory", *memory.lock().unwrap())
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    Ok(())
}
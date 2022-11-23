use std::sync::Arc;

use futures::lock::Mutex;
use wasmtime::{AsContextMut, Caller, Linker, Memory};

use crate::{error::WrapperError, wasm_runtime::instance::State};

pub fn read_from_memory(buffer: &mut [u8], ptr: usize, len: usize) -> Vec<u8> {
    buffer[ptr..(ptr + len)].to_vec()
}

fn write_to_memory(buffer: &mut [u8], ptr: usize, data: &[u8]) {
    buffer[ptr..(ptr + data.len())].copy_from_slice(data);
}

pub async fn create_imports(
    linker: &mut Linker<State>,
    arc_memory: &Arc<Mutex<Memory>>,
) -> Result<(), WrapperError> {
    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap1_async(
            "wrap",
            "__dt_fill_input_buffer",
            move |mut caller: Caller<'_, State>, buffer_ptr: u32| {

                let memory = Arc::clone(&memory);
                Box::new(async move {
                    let memory = memory.lock().await;
                    let (memory_buffer, state) = memory.data_and_store_mut(caller.as_context_mut());
    
                    write_to_memory(memory_buffer, buffer_ptr as usize, &state.input_buffer);
                })
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap2_async(
            "wrap",
            "__dt_send",
            move |mut caller: Caller<'_, State>,
                  buffer_ptr: u32,
                  buffer_len: u32| {

                let memory = Arc::clone(&memory);
                Box::new(async move {
                    let memory = memory.lock().await;
                    let (memory_buffer, state) = memory.data_and_store_mut(caller.as_context_mut());
                    let buffer =
                        read_from_memory(memory_buffer, buffer_ptr as usize, buffer_len as usize);

                    let receiver = match state.receiver.as_ref() {
                        Some(r) => r,
                        None => panic!("No receiver"),
                    };

                    let result = receiver.receive(&buffer[..]).await;

                    let result_len = result.len() as u32;

                    state.send_result = result.to_vec();

                    result_len
                })
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap1_async(
            "wrap",
            "__dt_fill_send_result",
            move |mut caller: Caller<'_, State>, buffer_ptr: u32| {
                let memory = Arc::clone(&memory);
                Box::new(async move {
                    let memory = memory.lock().await;
                    let (memory_buffer, state) = memory.data_and_store_mut(caller.as_context_mut());

                    write_to_memory(memory_buffer, buffer_ptr as usize, &state.send_result);
                })
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    linker
        .func_wrap6_async(
            "wrap",
            "__wrap_abort",
            move |mut caller: Caller<'_, State>,
                msg_ptr: u32,
                msg_len: u32,
                file_ptr: u32,
                file_len: u32,
                line: u32,
                column: u32| {
                let memory = Arc::clone(&memory);
                Box::new(async move {
                    let memory = memory.lock().await;
                    let (memory_buffer, _) = memory.data_and_store_mut(caller.as_context_mut());
                    let msg = read_from_memory(memory_buffer, msg_ptr as usize, msg_len as usize);
                    let file = read_from_memory(memory_buffer, file_ptr as usize, file_len as usize);

                    let msg_str = String::from_utf8(msg).unwrap();
                    let file_str = String::from_utf8(file).unwrap();

                    panic!(
                        "__wrap_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]",
                        msg = msg_str,
                        file = file_str,
                        line = line,
                        column = column
                    );
                })
            },
        )
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    let memory = Arc::clone(&arc_memory);
    let memory = *memory.lock().await;
    linker
        .define("env", "memory", memory)
        .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

    Ok(())
}
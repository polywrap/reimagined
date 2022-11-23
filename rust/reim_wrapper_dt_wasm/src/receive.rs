use std::sync::Arc;

use reim_dt::{InternalModule, ExternalModule};

pub fn receive(buffer: &[u8], internal_module: &dyn InternalModule, external_module: Arc<dyn ExternalModule>) -> u32 {      
    let result = internal_module.receive(buffer, external_module);

    let len_and_result_buffer = [
        &(result.len() as u32).to_be_bytes(), 
        &result[..]
    ].concat();
    
    let len_and_result_ptr = len_and_result_buffer.as_ptr();
    std::mem::forget(len_and_result_buffer);

    return len_and_result_ptr as u32;
}
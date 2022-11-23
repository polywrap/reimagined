use std::sync::Arc;

use reim_dt::{InternalModule, ExternalModule};

use crate::imports::__dt_fill_input_buffer;
use crate::malloc::alloc;
use crate::receive;
use crate::abort::wrap_abort_setup;

pub fn wasm_receive(input_buffer_len: u32, internal_module: &dyn InternalModule, external_module: Arc<dyn ExternalModule>) -> u32 {      
    wrap_abort_setup();
   
    let input_buffer_ptr = alloc(input_buffer_len as usize);

    unsafe { __dt_fill_input_buffer(input_buffer_ptr as u32) };

    let input_buffer =
        unsafe { Vec::from_raw_parts(input_buffer_ptr, input_buffer_len as usize, input_buffer_len as usize) };

    receive(&input_buffer[..], internal_module, external_module)
}

use std::sync::Arc;

use reim_dt::ExternalModule;
use reim_wrapper_dt_wasm::imports::__dt_fill_input_buffer;
use reim_wrapper_dt_wasm::malloc::alloc;
use reim_wrapper_dt_wasm::{receive, HostModule};
use reim_wrapper_dt_wasm::abort::wrap_abort_setup;

use super::external::module::external_wrap_module;
use super::external::module::internal_wrap_module::InternalWrapModule;

#[no_mangle]
pub async extern "C" fn _dt_receive(input_buffer_len: u32) -> u32 {
    wrap_abort_setup();
   
    let input_buffer_ptr = alloc(input_buffer_len as usize);

    unsafe { __dt_fill_input_buffer(input_buffer_ptr as u32) };

    let input_buffer =
        unsafe { Vec::from_raw_parts(input_buffer_ptr, input_buffer_len as usize, input_buffer_len as usize) };

    let external_module: Arc<dyn ExternalModule> = Arc::new(HostModule::new());
    let mut global_external_module = external_wrap_module.lock().await;
    *global_external_module = Some(Arc::clone(&external_module));

    let internal_module = InternalWrapModule::new();

    receive(&input_buffer[..], &internal_module, external_module)
}

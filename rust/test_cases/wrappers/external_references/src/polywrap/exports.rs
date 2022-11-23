use std::sync::Arc;

use reim_dt::ExternalModule;
use reim_wrapper_dt_wasm::{HostModule, wasm_receive};

use super::internal::internal_wrap_module::InternalWrapModule;


#[no_mangle]
pub extern "C" fn _dt_receive(input_buffer_len: u32) -> u32 {
    let internal_module = InternalWrapModule {};

    let external_module: Arc<dyn ExternalModule> = Arc::new(HostModule::new());

    wasm_receive(input_buffer_len, &internal_module, external_module)
}

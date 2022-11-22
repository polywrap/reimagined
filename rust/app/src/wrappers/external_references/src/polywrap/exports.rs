use std::sync::Arc;

use reim_dt::ExternalModule;
use reim_wrapper_dt_wasm::{HostModule, wasm_receive};

use super::external::module::external_wrap_module;
use super::external::module::internal_wrap_module::InternalWrapModule;

#[no_mangle]
pub async extern "C" fn _dt_receive(input_buffer_len: u32) -> u32 {
    let internal_module = InternalWrapModule::new();

    let external_module: Arc<dyn ExternalModule> = Arc::new(HostModule::new());
    let mut global_external_module = external_wrap_module.lock().await;
    *global_external_module = Some(Arc::clone(&external_module));

    wasm_receive(input_buffer_len, &internal_module, external_module).await
}

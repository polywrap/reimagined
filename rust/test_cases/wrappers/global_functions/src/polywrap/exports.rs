use std::sync::Arc;

use futures::executor::block_on;
use reim_dt::ExternalModule;
use reim_wrapper_dt_wasm::{HostModule, wasm_receive};

use super::{internal::internal_wrap_module::InternalWrapModule, external::module::external_wrap_module::set_external_module};


#[no_mangle]
pub extern "C" fn _dt_receive(input_buffer_len: u32) -> u32 {
    let internal_module = InternalWrapModule {};

    let external_module: Arc<dyn ExternalModule> = Arc::new(HostModule::new());

    // Set the static external module to the newly instantiated one.
    // This module will be called by non-scoped external functions and methods
    block_on(async { 
        set_external_module(Arc::clone(&external_module)).await
    });

    wasm_receive(input_buffer_len, &internal_module, external_module)
}

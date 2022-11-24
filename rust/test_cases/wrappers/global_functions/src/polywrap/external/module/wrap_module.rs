use std::sync::Arc;

use reim_dt::ExternalModule;
use crate::polywrap::external::module::import_bindings::{ ImportBindings };

use crate::polywrap::external::global_functions::test_host_global_function::{ create as createTestHostGlobalFunction };

use crate::polywrap::external::module::external_wrap_module::set_external_module;

pub struct WrapModule {}

impl WrapModule {
  pub async fn connect(external_module: Arc<dyn ExternalModule>) {
    set_external_module(external_module).await;
  }

  pub fn import(instance: Arc<dyn ExternalModule>) -> ImportBindings {
    ImportBindings::new(
                                                      
      createTestHostGlobalFunction(Arc::clone(&instance)),
    )
  }
}

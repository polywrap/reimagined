use std::sync::Arc;

use reim_dt::ExternalModule;

use super::{import_bindings::ImportBindings, external_wrap_module::set_external_module};
use crate::bindings::global_functions::polywrap::external::global_functions::test_wrapper_global_function::create as createTestInternalGlobalFunction;
pub struct WrapModule {}

impl WrapModule {
  pub async fn connect(external_module: Arc<dyn ExternalModule>) {
    set_external_module(external_module).await;
  }

  pub fn import(instance: Arc<dyn ExternalModule>) -> ImportBindings {
    ImportBindings::new(
                                                      
        createTestInternalGlobalFunction(Arc::clone(&instance)),
    )
  }
}

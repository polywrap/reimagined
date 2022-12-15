use std::sync::Arc;

use reim_dt::ExternalModule;
use crate::polywrap::external::module::import_bindings::{ ImportBindings };

use crate::polywrap::external::global_functions::test_external_global_function::{ create as createTestExternalGlobalFunction };

use crate::polywrap::external::classes::test_external_class::{ create as createTestExternalClass };

use crate::polywrap::external::module::external_wrap_module::set_external_module;

pub struct WrapModule {}

impl WrapModule {
  pub async fn connect(external_module: Arc<dyn ExternalModule>) {
    set_external_module(external_module).await;
  }

  pub fn import(instance: Arc<dyn ExternalModule>) -> ImportBindings {
    ImportBindings::new(
                                                      
      createTestExternalGlobalFunction(Arc::clone(&instance)),
      
                  
      createTestExternalClass(Arc::clone(&instance)),
      
    )
  }
}

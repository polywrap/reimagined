use std::sync::Arc;

use reim_dt::ExternalModule;
use crate::polywrap::external::module::import_bindings::{ ImportBindings };

use crate::polywrap::external::global_functions::test_external_global_function::{ create as createTestExternalGlobalFunction };

use crate::polywrap::external::classes::test_external_class::{ create as createTestExternalClass };

pub struct WrapModule {}

impl WrapModule {
  pub fn connect(external_module: Arc<dyn ExternalModule>) {
    // set_external_module(external_module);
  }

  pub fn import(instance: Arc<dyn ExternalModule>) -> ImportBindings {
    ImportBindings::new(
                                                      
      createTestExternalGlobalFunction(Arc::clone(&instance)),
      
                  
      createTestExternalClass(Arc::clone(&instance)),
      
    )
  }
}

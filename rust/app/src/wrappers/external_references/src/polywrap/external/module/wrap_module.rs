use std::sync::Arc;

use reim_wrap::{ ExternalModule };
use crate::polywrap::external::module::import_bindings::{ ImportBindings };

use crate::polywrap::external::global_functions::test_external_global_function::{ create as createTestExternalGlobalFunction };

use crate::polywrap::external::classes::test_external_class::{ create as createTestExternalClass };

pub static external_wrap_module: Option<Arc<dyn ExternalModule>> = None;

pub struct WrapModule {}

impl WrapModule {
  pub fn connect(instance: Arc<dyn ExternalModule>) {
    external_wrap_module = Some(instance);
  }

  pub fn import(instance: Arc<dyn ExternalModule>) -> ImportBindings {
    ImportBindings::new(
                                                      
      createTestExternalGlobalFunction(instance),
      
                  
      createTestExternalClass(instance),
      
    )
  }
}

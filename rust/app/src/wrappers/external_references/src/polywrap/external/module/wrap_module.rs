use std::sync::{Arc, Mutex};
use lazy_static::lazy_static;

use reim_wrap::{ ExternalModule };
use crate::polywrap::external::module::import_bindings::{ ImportBindings };

use crate::polywrap::external::global_functions::test_external_global_function::{ create as createTestExternalGlobalFunction };

use crate::polywrap::external::classes::test_external_class::{ create as createTestExternalClass };

lazy_static! {
    pub static ref external_wrap_module: Arc<Mutex<Option<Arc<dyn ExternalModule>>>> = Arc::new(Mutex::new(None));
}

pub fn get_external_module_or_panic() -> Arc<dyn ExternalModule> {
    let external_module = external_wrap_module.lock().unwrap();

    if external_module.is_none() {
        panic!("connect() must be called before using this module");
    }

    let external_module = Arc::clone(external_module.as_ref().unwrap());

    external_module
}

pub struct WrapModule {}

impl WrapModule {
  pub fn connect(instance: Arc<dyn ExternalModule>) {
    let external_module = Arc::clone(&external_wrap_module);
    let mut external_module = external_wrap_module.lock().unwrap();
    *external_module = Some(instance);
  }

  pub fn import(instance: Arc<dyn ExternalModule>) -> ImportBindings {
    ImportBindings::new(
                                                      
      createTestExternalGlobalFunction(&instance),
      
                  
      createTestExternalClass(&instance),
      
    )
  }
}

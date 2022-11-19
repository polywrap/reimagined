use reim_wrap::{ ExternalWrapModule };
use ImportBindings;

use external::global_functions::testReceiveReference::{ create as createTestReceiveReference };
use external::global_functions::testInvokeExternalGlobalFunction::{ create as createTestInvokeExternalGlobalFunction };
use external::global_functions::testInvokeExternalStaticMethod::{ create as createTestInvokeExternalStaticMethod };
use external::global_functions::testInvokeExternalInstanceMethod::{ create as createTestInvokeExternalInstanceMethod };

use external::classes::TestObjectGetter::{ create as createTestObjectGetter };


struct WrapModule {}

impl WrapModule {
  static wrapInstance: Option<Box<dyn ExternalWrapModule>>;

  pub fn connect(instance: dyn ExternalWrapModule) {
    WrapModule.wrapInstance = Box::new(instance);
  }

  pub fn import(instance: dyn ExternalWrapModule) -> ImportBindings {
    ImportBindings.new(
      
      createTestReceiveReference(instance),
            
      createTestInvokeExternalGlobalFunction(instance),
            
      createTestInvokeExternalStaticMethod(instance),
            
      createTestInvokeExternalInstanceMethod(instance),
                  
      
      createTestObjectGetter(instance),
                  
    )
  }
}

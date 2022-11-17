#![feature(async_closure)]

mod polywrap;
use std::sync::Arc;

use polywrap::external::{*, module::{WrapModule, import_bindings::ImportBindings, external_wrap_module}};

pub async fn testReceiveReference(arg: Arc<TestExternalClass>) -> String {
    let external_module_mut = external_wrap_module.as_ref().unwrap();
    let module = WrapModule::import(Arc::clone(external_module_mut));

    let ImportBindings { testExternalGlobalFunction, TestExternalClass  } = module; 

    testExternalGlobalFunction("test".to_string()).await
    // arg.testInstanceMethod("test".to_string()).await
}

pub async fn testInvokeExternalGlobalFunction(arg: String) -> String {
    testExternalGlobalFunction(arg).await
}

pub async fn testInvokeExternalStaticMethod(arg: String) -> String {
    TestExternalClass::testStaticMethod(arg).await
}

pub async fn testInvokeExternalInstanceMethod(arg: String) -> String {
    let object = TestExternalClass::create(arg.clone()).await;

    object.testInstanceMethod(arg.clone()).await
}

pub struct TestObjectGetter {
    arg: String
}

impl TestObjectGetter {
    pub fn new(arg: String) -> Self {
        Self { arg }
    }

    pub async fn create(arg: String) -> TestObjectGetter {
        return TestObjectGetter::new(arg);
    }

    pub async fn testStaticReceiveReference(arg: Arc<TestExternalClass>) -> String {
        return arg.testInstanceMethod("test".to_string()).await;
    }

    pub async fn testInstanceReceiveReference(&self, arg: Arc<TestExternalClass>) -> String {
        return arg.testInstanceMethod("test".to_string()).await;
    }
}

#![feature(async_closure)]

mod polywrap;
use std::sync::Arc;

use polywrap::external::{testExternalGlobalFunction, TestExternalClass};

pub async fn testReceiveReference(arg: Arc<TestExternalClass>) -> String {
    arg.testInstanceMethod("test".to_string()).await
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

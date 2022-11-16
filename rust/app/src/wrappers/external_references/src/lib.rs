#![feature(async_closure)]

mod polywrap;
use polywrap::external::*;

pub async fn testReceiveReference(arg: TestExternalClass) -> String {
    arg.testInstanceMethod("test".to_string()).await
}

pub async fn testInvokeExternalGlobalFunction(arg: String) -> String {
    testExternalGlobalFunction(arg).await
}

pub async fn testInvokeExternalStaticMethod(arg: String) -> String {
    TestExternalClass::testStaticMethod(arg).await
}

pub async fn testInvokeExternalInstanceMethod(arg: String) -> String {
    let object = TestExternalClass::create(arg);

    object.testInstanceMethod(arg).await
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

    pub async fn testStaticReceiveReference(arg: TestExternalClass) -> String {
        return arg.testInstanceMethod("test".to_string()).await;
    }

    pub async fn testInstanceReceiveReference(self, arg: TestExternalClass) -> String {
        return arg.testInstanceMethod("test".to_string()).await;
    }
}

use std::future::Future;
use std::sync::Arc;

use reim_wrap::{ ExternalModule };
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::polywrap::module::{ WrapManifest };
use crate::polywrap::dt::{ ExternalResource };
use crate::polywrap::external::module::{ external_wrap_module };

pub async fn testExternalGlobalFunction(
  arg: String,
) -> String {
    if external_wrap_module.is_none() {
        panic!("connect() or import() must be called before using this module");
    }

    let external_module = Arc::clone(external_wrap_module.as_ref().unwrap());
  
    testExternalGlobalFunctionFromInstance(
        external_module,
        arg,
    ).await
}

pub fn create(instance: Arc<dyn ExternalModule>) -> MockClosure {
    MockClosure::new(instance)
}

struct MockClosure {
    instance: Arc<dyn ExternalModule>,
}

impl MockClosure {
    pub fn new(instance: Arc<dyn ExternalModule>) -> Self {
        Self {
            instance,
        }
    }

    pub async fn call(
        &self,
        arg: String,
    ) -> String {
        testExternalGlobalFunctionFromInstance(
            Arc::clone(&self.instance),
            arg,
        ).await
    }
}

pub async fn testExternalGlobalFunctionFromInstance (
  instance: Arc<dyn ExternalModule>, 
  arg: String,
) -> String {
  let args = TestExternalGlobalFunctionArgs::new(
    arg,
  );

  let buffer = [
    &(WrapManifest::External::GlobalFunction::TestExternalGlobalFunction as u32).to_be_bytes()[..],
    TestExternalGlobalFunctionArgsWrapped::serialize(&args),
  ].concat();

  let result = instance.invoke_resource(ExternalResource::InvokeGlobalFunction as u32, &buffer).await;
  
  BaseTypeSerialization.deserialize<String>(result)
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestExternalGlobalFunctionArgsWrapped {
    pub arg: String,
}
impl TestExternalGlobalFunctionArgsWrapped {
    pub fn new(
      arg: String,
    ) -> TestExternalGlobalFunctionArgsWrapped {
      TestExternalGlobalFunctionArgsWrapped {
        arg,
      }
    }

    pub fn serialize(value: &TestExternalGlobalFunctionArgs) -> &[u8] {
        json!(
            TestExternalGlobalFunctionArgsWrapped::mapToSerializable(value)
        ).to_string()
        .as_bytes()
    }

    pub fn mapToSerializable(value: &TestExternalGlobalFunctionArgs) -> TestExternalGlobalFunctionArgsWrapped {
        TestExternalGlobalFunctionArgsWrapped::new(
                        
            value.arg,
            
        )
    }
}

struct TestExternalGlobalFunctionArgs {
    pub arg: String,
}

impl TestExternalGlobalFunctionArgs {
  pub fn new(
    arg: String,
  ) -> TestExternalGlobalFunctionArgs {
    TestExternalGlobalFunctionArgs::new (
      arg,
    )
  }
}

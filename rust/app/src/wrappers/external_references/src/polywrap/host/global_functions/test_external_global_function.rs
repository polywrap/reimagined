use std::sync::Arc;

use reim_wrap::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::polywrap::wrap_manifest::WrapManifest;
use crate::polywrap::resources::ExternalResource;
use crate::polywrap::external::module::external_wrap_module;
use crate::polywrap::wrapped::StringWrapped;

pub async fn testExternalGlobalFunction(
  arg: String,
) -> String {
    let external_module = HostWrapModule::new();
  
    testExternalGlobalFunction_from_instance(
        external_module,
        arg,
    ).await
}

pub fn create(instance: Arc<dyn ExternalModule>) -> WrappedClosure {
    WrappedClosure::new(instance)
}

pub struct WrappedClosure {
    instance: Arc<dyn ExternalModule>,
}

impl WrappedClosure {
    pub fn new(instance: Arc<dyn ExternalModule>) -> Self {
        Self {
            instance,
        }
    }

    pub async fn call(
        &self,
        arg: String,
    ) -> String {
        testExternalGlobalFunction_from_instance(
            Arc::clone(&self.instance),
            arg,
        ).await
    }
}

pub async fn testExternalGlobalFunction_from_instance (
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

  let instance = Arc::clone(&instance);

  let result = dt.invoke_resource(ExternalResource::InvokeGlobalFunction as u32, &buffer).await;
  
  StringWrapped::deserialize(&result)
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestExternalGlobalFunctionArgsWrapped {
    pub arg: String,
}
impl TestExternalGlobalFunctionArgsWrapped {
    pub fn new(
      arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn serialize(value: &TestExternalGlobalFunctionArgs) -> &[u8] {
        Self::serialize_wrapped(
            &Self::map_to_serializable(value)
        )
    }

    pub fn map_to_serializable(value: &TestExternalGlobalFunctionArgs) -> Self {
        Self::new(
                        
            value.arg,
            
        )
    }

    fn serialize_wrapped(value: &Self) -> &[u8] {
        json!(
           value
        ).to_string()
        .as_bytes()
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

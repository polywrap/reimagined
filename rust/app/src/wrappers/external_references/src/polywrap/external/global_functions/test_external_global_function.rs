use std::sync::Arc;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::polywrap::external::module::wrap_module::get_external_module_or_panic;
use crate::polywrap::wrap::{ExternalResource, wrap_manifest};
use crate::polywrap::internal::wrapped::StringWrapped;

pub fn testExternalGlobalFunction(
  arg: String,
) -> String {
    let external_module = get_external_module_or_panic();
  
    testExternalGlobalFunction_from_instance(
        external_module,
        arg,
    )
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

    pub fn call(
        &self,
        arg: String,
    ) -> String {
        testExternalGlobalFunction_from_instance(
            Arc::clone(&self.instance),
            arg,
        )
    }
}

pub fn testExternalGlobalFunction_from_instance (
  instance: Arc<dyn ExternalModule>, 
  arg: String,
) -> String {
  let args = TestExternalGlobalFunctionArgs::new(
    arg,
  );

  let buffer = [
    &(ExternalResource::InvokeGlobalFunction as u32).to_be_bytes()[..],
    &(wrap_manifest::external::GlobalFunction::TestExternalGlobalFunction as u32).to_be_bytes()[..],
    &TestExternalGlobalFunctionArgsWrapped::serialize(&args),
  ].concat();

  let instance = Arc::clone(&instance);

  let result = instance.send(&buffer);
  
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

    pub fn serialize(value: &TestExternalGlobalFunctionArgs) -> Vec<u8> {
        Self::serialize_wrapped(
            &Self::map_to_serializable(value)
        )
    }

    pub fn map_to_serializable(value: &TestExternalGlobalFunctionArgs) -> Self {
        Self::new(
                        
            value.arg.clone(),
            
        )
    }

    fn serialize_wrapped(value: &Self) -> Vec<u8> {
        json!(
           value
        ).to_string()
        .as_bytes()
        .to_vec()
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

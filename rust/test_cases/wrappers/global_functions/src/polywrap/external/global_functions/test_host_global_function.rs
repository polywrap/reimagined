use std::sync::Arc;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::polywrap::external::module::external_wrap_module::get_external_module_or_panic;
use crate::polywrap::utils;
use crate::polywrap::wrap::{ExternalResource, wrap_manifest};
use crate::polywrap::internal::wrapped::StringWrapped;

pub async fn test_host_global_function(
  arg: String,
) -> String {
    let external_module = get_external_module_or_panic().await;
  
    invoke_testHostGlobalFunction_from_instance(
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
        invoke_testHostGlobalFunction_from_instance(
            Arc::clone(&self.instance),
            arg,
        ).await
    }
}

pub async fn invoke_testHostGlobalFunction_from_instance (
  instance: Arc<dyn ExternalModule>, 
  arg: String,
) -> String {
  let args = TestHostGlobalFunctionArgs::new(
    arg,
  );

  let buffer = utils::serialize_invocation_buffer("testHostGlobalFunction", &TestHostGlobalFunctionArgsWrapped::serialize(&args));

  let instance = Arc::clone(&instance);

  let result = instance.send(&buffer).await;
  
  StringWrapped::deserialize(&result)
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestHostGlobalFunctionArgsWrapped {
    pub arg: String,
}
impl TestHostGlobalFunctionArgsWrapped {
    pub fn new(
      arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn serialize(value: &TestHostGlobalFunctionArgs) -> Vec<u8> {
        Self::serialize_wrapped(
            &Self::map_to_serializable(value)
        )
    }

    pub fn map_to_serializable(value: &TestHostGlobalFunctionArgs) -> Self {
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

struct TestHostGlobalFunctionArgs {
    pub arg: String,
}
impl TestHostGlobalFunctionArgs {
    pub fn new(
      arg: String,
    ) -> TestHostGlobalFunctionArgs {
        Self {
            arg,
        }
    }
}

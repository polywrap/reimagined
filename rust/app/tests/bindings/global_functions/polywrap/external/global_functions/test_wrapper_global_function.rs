use std::sync::Arc;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::bindings::global_functions::polywrap::external::module::external_wrap_module::get_external_module_or_panic;
use crate::bindings::global_functions::polywrap::internal::wrapped::StringWrapped;
use super::super::super::utils;

pub async fn test_wrapper_global_function(
  arg: String,
) -> String {
    let external_module = get_external_module_or_panic().await;
  
    testInternalGlobalFunction_from_instance(
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
        testInternalGlobalFunction_from_instance(
            Arc::clone(&self.instance),
            arg,
        ).await
    }
}

pub async fn testInternalGlobalFunction_from_instance (
  instance: Arc<dyn ExternalModule>, 
  arg: String,
) -> String {
    let args = TestInternalGlobalFunctionArgs::new(
        arg,
    );

    let buffer = utils::serialize_invocation_buffer("testWrapperGlobalFunction", &TestInternalGlobalFunctionArgsWrapped::serialize(&args));
  
    println!("buffer: {:?}", buffer);
    let instance = Arc::clone(&instance);
  
    let result = instance.send(&buffer).await;
    
    StringWrapped::deserialize(&result)
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestInternalGlobalFunctionArgsWrapped {
    pub arg: String,
}
impl TestInternalGlobalFunctionArgsWrapped {
    pub fn new(
      arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn serialize(value: &TestInternalGlobalFunctionArgs) -> Vec<u8> {
        Self::serialize_wrapped(
            &Self::map_to_serializable(value)
        )
    }

    pub fn map_to_serializable(value: &TestInternalGlobalFunctionArgs) -> Self {
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

struct TestInternalGlobalFunctionArgs {
    pub arg: String,
}
impl TestInternalGlobalFunctionArgs {
  pub fn new(
    arg: String,
  ) -> TestInternalGlobalFunctionArgs {
    Self {
      arg,
    }
  }
}

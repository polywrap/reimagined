use std::sync::Arc;
use std::str;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};

use crate::bindings::global_functions::polywrap::wrap::wrap_manifest;
use crate::bindings::global_functions::test_host_global_function;

use super::wrapped::StringWrapped;

pub async fn invoke_global_function(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer[0..4].try_into().expect("Function ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
    
    x if x == wrap_manifest::internal::GlobalFunction::TestExternalGlobalFunction as u32 =>
        invokeTestExternalGlobalFunctionWrapped(data_buffer, external_module).await,
    _ => panic!("Unknown internal global function ID: {}", func_id.to_string()),
  }
}

async fn invokeTestExternalGlobalFunctionWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestExternalGlobalFunctionArgsWrapped::deserialize(args_buffer, external_module);

  let result = test_host_global_function(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestExternalGlobalFunctionArgs {
    pub arg: String,
}
 
impl TestExternalGlobalFunctionArgs {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestExternalGlobalFunctionArgsWrapped {
    pub arg: String,
}

impl TestExternalGlobalFunctionArgsWrapped {
    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestExternalGlobalFunctionArgs {
        let args: TestExternalGlobalFunctionArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestExternalGlobalFunctionArgs::new(
            
            StringWrapped::map_from_serializable(args.arg),
                        
        )
    }  
}

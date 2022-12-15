use std::sync::Arc;
use std::str;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};

use crate::bindings::global_functions::test_host_global_function;

use super::wrapped::StringWrapped;

pub async fn invoke_global_function(function_name: &str, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  match function_name {
    x if x == "testHostGlobalFunction" =>
        invokeTestHostGlobalFunctionWrapped(buffer, external_module).await,
    _ => panic!("Unknown function: {}", function_name.to_string()),
  }
}

async fn invokeTestHostGlobalFunctionWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestHostGlobalFunctionArgsWrapped::deserialize(args_buffer, external_module);

  let result = test_host_global_function(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestHostGlobalFunctionArgs {
    pub arg: String,
}
 
impl TestHostGlobalFunctionArgs {
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
struct TestHostGlobalFunctionArgsWrapped {
    pub arg: String,
}

impl TestHostGlobalFunctionArgsWrapped {
    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestHostGlobalFunctionArgs {
        let args: TestHostGlobalFunctionArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestHostGlobalFunctionArgs::new(
            
            StringWrapped::map_from_serializable(args.arg),
                        
        )
    }  
}

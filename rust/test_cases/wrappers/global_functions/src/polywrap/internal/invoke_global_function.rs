use std::sync::Arc;
use std::str;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use crate::polywrap::wrap::wrap_manifest;
use crate::{ 
    test_wrapper_global_function,
};
use crate::polywrap::internal::wrapped::StringWrapped;

use super::log::log;

pub async fn invoke_global_function(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer[0..4].try_into().expect("Function ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  log(&format!("Function {:?} => {:?}", func_id, data_buffer), Arc::clone(&external_module)).await;

  match func_id {
    
    x if x == wrap_manifest::internal::GlobalFunction::TestWrapperGlobalFunction as u32 =>
        invokeTestWrapperGlobalFunctionWrapped(data_buffer, external_module).await,
    _ => panic!("Unknown internal global function ID: {}", func_id.to_string()),
  }
}

async fn invokeTestWrapperGlobalFunctionWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestWrapperGlobalFunctionArgsWrapped::deserialize(args_buffer, Arc::clone(&external_module));

  log(&format!("Got arg: {:?}", args.arg), Arc::clone(&external_module)).await;

  let result = test_wrapper_global_function(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestWrapperGlobalFunctionArgs {
    pub arg: String,
}
 
impl TestWrapperGlobalFunctionArgs {
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
struct TestWrapperGlobalFunctionArgsWrapped {
    pub arg: String,
}

impl TestWrapperGlobalFunctionArgsWrapped {
    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestWrapperGlobalFunctionArgs {
        let args: TestWrapperGlobalFunctionArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestWrapperGlobalFunctionArgs::new(
            
            StringWrapped::map_from_serializable(args.arg),
                        
        )
    }  
}

use std::sync::Arc;
use std::str;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use crate::{ 
    test_wrapper_global_function,
};
use crate::polywrap::internal::wrapped::StringWrapped;

use super::log::log;

pub async fn invoke_global_function(function_name: &str, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  log(&format!("Function {:?} => {:?}", function_name, buffer), Arc::clone(&external_module)).await;

  match function_name {
    
    x if x == "testWrapperGlobalFunction" =>
      invoke_testWrapperGlobalFunction_wrapped(buffer, external_module).await,
    _ => panic!("Unknown function: {}", function_name.to_string()),
  }
}

async fn invoke_testWrapperGlobalFunction_wrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
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

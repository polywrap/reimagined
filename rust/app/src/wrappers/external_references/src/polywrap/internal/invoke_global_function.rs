use std::sync::Arc;
use std::str;

use reim_wrap::ExternalModule;
use serde::{Deserialize, Serialize};
use crate::polywrap::wrap_manifest::WrapManifest;
use crate::{ 
  
  testReceiveReference,
    
  testInvokeExternalGlobalFunction,
    
  testInvokeExternalStaticMethod,
    
  testInvokeExternalInstanceMethod,
       
};
use crate::polywrap::wrapped::{TestExternalClassWrapped, StringWrapped};
use crate::polywrap::external::TestExternalClass;


pub async fn invoke(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer.try_into().expect("Function ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
    
    x if x == WrapManifest::Internal::GlobalFunction::TestReceiveReference as u32 =>
        invokeTestReceiveReferenceWrapped(data_buffer, external_module).await,
        
    x if x == WrapManifest::Internal::GlobalFunction::TestInvokeExternalGlobalFunction as u32 =>
        invokeTestInvokeExternalGlobalFunctionWrapped(data_buffer, external_module).await,
        
    x if x == WrapManifest::Internal::GlobalFunction::TestInvokeExternalStaticMethod as u32 =>
        invokeTestInvokeExternalStaticMethodWrapped(data_buffer, external_module).await,
        
    x if x == WrapManifest::Internal::GlobalFunction::TestInvokeExternalInstanceMethod as u32 =>
        invokeTestInvokeExternalInstanceMethodWrapped(data_buffer, external_module).await,
            
    _ => panic!("Unknown internal global function ID: {}", func_id.to_string()),
  }
}

async fn invokeTestReceiveReferenceWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestReceiveReferenceArgsWrapped::deserialize(args_buffer, external_module);

  let result = testReceiveReference(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestReceiveReferenceArgs {
    pub arg: Arc<TestExternalClass>,
}
 
impl TestReceiveReferenceArgs {
    pub fn new(
        arg: Arc<TestExternalClass>,
    ) -> Self {
        Self {
            arg,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestReceiveReferenceArgsWrapped {
    pub fn new(
        arg: TestExternalClassWrapped,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestReceiveReferenceArgs {
        let args: TestReceiveReferenceArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestReceiveReferenceArgs::new(
            
            TestExternalClassWrapped::map_from_serializable(&args.arg, external_module),
                        
        )
    }  
}
async fn invokeTestInvokeExternalGlobalFunctionWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestInvokeExternalGlobalFunctionArgsWrapped::deserialize(args_buffer, external_module);

  let result = testInvokeExternalGlobalFunction(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestInvokeExternalGlobalFunctionArgs {
    pub arg: String,
}
 
impl TestInvokeExternalGlobalFunctionArgs {
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
struct TestInvokeExternalGlobalFunctionArgsWrapped {
    pub arg: String,
}

impl TestInvokeExternalGlobalFunctionArgsWrapped {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestInvokeExternalGlobalFunctionArgs {
        let args: TestInvokeExternalGlobalFunctionArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestInvokeExternalGlobalFunctionArgs::new(
                        
            args.arg,
            
        )
    }  
}
async fn invokeTestInvokeExternalStaticMethodWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestInvokeExternalStaticMethodArgsWrapped::deserialize(args_buffer, external_module);

  let result = testInvokeExternalStaticMethod(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestInvokeExternalStaticMethodArgs {
    pub arg: String,
}
 
impl TestInvokeExternalStaticMethodArgs {
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
struct TestInvokeExternalStaticMethodArgsWrapped {
    pub arg: String,
}

impl TestInvokeExternalStaticMethodArgsWrapped {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestInvokeExternalStaticMethodArgs {
        let args: TestInvokeExternalStaticMethodArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestInvokeExternalStaticMethodArgs::new(
                        
            args.arg,
            
        )
    }  
}
async fn invokeTestInvokeExternalInstanceMethodWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestInvokeExternalInstanceMethodArgsWrapped::deserialize(args_buffer, external_module);

  let result = testInvokeExternalInstanceMethod(
    args.arg,
  ).await;

  
  StringWrapped::serialize(&result).to_vec()
}

struct TestInvokeExternalInstanceMethodArgs {
    pub arg: String,
}
 
impl TestInvokeExternalInstanceMethodArgs {
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
struct TestInvokeExternalInstanceMethodArgsWrapped {
    pub arg: String,
}

impl TestInvokeExternalInstanceMethodArgsWrapped {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestInvokeExternalInstanceMethodArgs {
        let args: TestInvokeExternalInstanceMethodArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestInvokeExternalInstanceMethodArgs::new(
                        
            args.arg,
            
        )
    }  
}


use std::sync::Arc;
use std::str;

use reim_wrap::{ ExternalModule };
use serde::{Serialize, Deserialize};
use crate::polywrap::wrap_manifest::{ WrapManifest };

use crate::{ TestObjectGetter };

use crate::polywrap::wrapped::{ TestObjectGetterWrapped };
use crate::polywrap::wrapped::{ TestExternalClassWrapped };
use crate::polywrap::wrapped::test_object_getter::test_object_getter_wrapped::CLASS_NAME;
use crate::polywrap::external::classes::{ TestExternalClass };

pub async fn invoke(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer.try_into().expect("Method ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
    x if x == WrapManifest::Internal::Classes::TestObjectGetterMethod::Create as u32 =>
        invokeCreateWrapped(data_buffer, external_module).await,
    x if x == WrapManifest::Internal::Classes::TestObjectGetterMethod::TestInstanceReceiveReference as u32 =>
        invokeTestInstanceReceiveReferenceWrapped(data_buffer, external_module).await,
    x if x == WrapManifest::Internal::Classes::TestObjectGetterMethod::TestStaticReceiveReference as u32 =>
        invokeTestStaticReceiveReferenceWrapped(data_buffer, external_module).await,
    _ => panic!("Unknown method: {} on class {}", func_id, CLASS_NAME)
  }
}

async fn invokeCreateWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
    let args = CreateArgsWrapped::deserialize(buffer, external_module);

    let result = TestObjectGetter::create(
        args.arg,
    ).await;
    
    TestObjectGetterWrapped::serialize(&result).to_vec()
}

struct CreateArgs {
    pub arg: String,
}

impl CreateArgs {
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
struct CreateArgsWrapped {
    pub arg: String,
}

impl CreateArgsWrapped {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> CreateArgs {
        let args: CreateArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        CreateArgs::new(
                
            args.arg,
        
        )
    }  
}
async fn invokeTestInstanceReceiveReferenceWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
    
    let reference_ptr = u32::from_be_bytes(buffer.try_into().expect("Reference ptr must be 4 bytes"));
    let data_buffer = &buffer[4..];

    let args = TestInstanceReceiveReferenceArgsWrapped::deserialize(data_buffer, external_module);

    let object = TestObjectGetterWrapped::dereference(reference_ptr);

    let result = object.testInstanceReceiveReference(
        args.arg,
    ).await;

    
    BaseTypeSerialization.serialize<String>(result)
}

struct TestInstanceReceiveReferenceArgs {
    pub arg: TestExternalClass,
}

impl TestInstanceReceiveReferenceArgs {
    pub fn new(
        arg: TestExternalClass,
    ) -> Self {
        Self {
            arg,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestInstanceReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestInstanceReceiveReferenceArgsWrapped {
    pub fn new(
        arg: TestExternalClassWrapped,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestInstanceReceiveReferenceArgs {
        let args: TestInstanceReceiveReferenceArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestInstanceReceiveReferenceArgs::new(
        
            TestExternalClassWrapped::map_from_serializable(&args.arg, external_module),
                
        )
    }  
}
async fn invokeTestStaticReceiveReferenceWrapped(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
    let args = TestStaticReceiveReferenceArgsWrapped::deserialize(buffer, external_module);

    let result = TestObjectGetter::testStaticReceiveReference(
        args.arg,
    ).await;
    
    
    BaseTypeSerialization.serialize<String>(result)
};

struct TestStaticReceiveReferenceArgs {
    pub arg: TestExternalClass,
}

impl TestStaticReceiveReferenceArgs {
    pub fn new(
        arg: TestExternalClass,
    ) -> Self {
        Self {
            arg,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestStaticReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestStaticReceiveReferenceArgsWrapped {
    pub fn new(
        arg: TestExternalClassWrapped,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestStaticReceiveReferenceArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestStaticReceiveReferenceArgs::new(
        
            TestExternalClassWrapped.map_from_serializable(args.arg, external_module),
                
        )
    }  
}

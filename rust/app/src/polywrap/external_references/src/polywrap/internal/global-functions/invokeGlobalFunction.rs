use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use crate::{ 
                  
  testExternalGlobalFunction,
   
};
use wrapped::{ TestExternalClassWrapped };

use crate::{ TestExternalClass };



async fn invoke(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer.try_into().expect("Function ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
                                    
    WrapManifest::Internal::GlobalFunction::TestExternalGlobalFunction =>
        invokeTestExternalGlobalFunctionWrapped(data_buffer, external_module),
    
    _ => panic!("Unknown function/method: ".to_string() + &func_id.to_string()),
  }
}

async fn invokeTestExternalGlobalFunctionWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
  let args_buffer = buffer;

  let args = TestExternalGlobalFunctionArgsWrapped.deserialize(args_buffer, external_module);

  let result = testExternalGlobalFunction(
    args.arg,
  ).await;

  
  BaseTypeSerialization.serialize<string>(result)
};

struct TestExternalGlobalFunctionArgs {
    pub arg: string,
}
 
impl TestExternalGlobalFunctionArgs {
    pub fn new(
        arg: string,
    ) -> Self {
        Self {
            arg,
        }
    }
}

struct TestExternalGlobalFunctionArgsWrapped {
    pub arg: string,
}

impl TestExternalGlobalFunctionArgsWrapped {
    pub fn new(
        arg: string,
    ) -> Self {
        Self {
            arg,
        }
    }

    pub fn deserialize(buffer: &[u8], external_module: dyn ExternalWrapModule) -> TestExternalGlobalFunctionArgs {
        let args: TestExternalGlobalFunctionArgsWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
       
        TestExternalGlobalFunctionArgs.new(
                        
            args.arg,
            
        )
    }  
}


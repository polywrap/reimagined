use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use internal::classes::{ TestExternalClassWrapped };

use crate::{ TestExternalClass };



pub async fn invoke(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer.try_into().expect("Method ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
    WrapManifest::Internal::Classes::TestExternalClassMethod::Create =>
        invokeCreateWrapped(data_buffer, external_module),
    WrapManifest::Internal::Classes::TestExternalClassMethod::TestInstanceMethod =>
        invokeTestInstanceMethodWrapped(data_buffer, external_module),
    WrapManifest::Internal::Classes::TestExternalClassMethod::TestStaticMethod =>
        invokeTestStaticMethodWrapped(data_buffer, external_module),
    _ => panic!(format!("Unknown method: {} on class {}", func_id.to_string(), model.class_name))
  }
}

async fn invokeCreateWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    let args = CreateArgsWrapped.deserialize(buffer, external_module);

    let result = TestExternalClass.create(
        args.arg,
    ).await;
    
    TestExternalClassWrapped.serialize(result)
    };

struct CreateArgs {
    pub arg: string,
}

impl CreateArgs {
    pub fn new(
        arg: string,
    ) -> Self {
        Self {
            arg,
        }
    }
}

struct CreateArgsWrapped {
    pub arg: string,
}

impl CreateArgsWrapped {
    pub fn new(
        arg: string,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalWrapModule) -> CreateArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        CreateArgs.new(
                
        args.arg,
        
        )
    }  
}
async fn invokeTestInstanceMethodWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    
    let reference_ptr = u32::from_be_bytes(buffer.try_into().expect("Reference ptr must be 4 bytes"));
    let data_buffer = &buffer[4..];

    let args = TestInstanceMethodArgsWrapped.deserialize(data_buffer, external_module);

    let object = TestExternalClassWrapped.dereference(reference_ptr);

    let result = object.testInstanceMethod(
        args.arg,
    ).await;

    
    BaseTypeSerialization.serialize<string>(result)
};

struct TestInstanceMethodArgs {
    pub arg: string,
}

impl TestInstanceMethodArgs {
    pub fn new(
        arg: string,
    ) -> Self {
        Self {
            arg,
        }
    }
}

struct TestInstanceMethodArgsWrapped {
    pub arg: string,
}

impl TestInstanceMethodArgsWrapped {
    pub fn new(
        arg: string,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalWrapModule) -> TestInstanceMethodArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestInstanceMethodArgs.new(
                
        args.arg,
        
        )
    }  
}
async fn invokeTestStaticMethodWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    let args = TestStaticMethodArgsWrapped.deserialize(buffer, external_module);

    let result = TestExternalClass.testStaticMethod(
        args.arg,
    ).await;
    
    
    BaseTypeSerialization.serialize<string>(result)
};

struct TestStaticMethodArgs {
    pub arg: string,
}

impl TestStaticMethodArgs {
    pub fn new(
        arg: string,
    ) -> Self {
        Self {
            arg,
        }
    }
}

struct TestStaticMethodArgsWrapped {
    pub arg: string,
}

impl TestStaticMethodArgsWrapped {
    pub fn new(
        arg: string,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalWrapModule) -> TestStaticMethodArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestStaticMethodArgs.new(
                
        args.arg,
        
        )
    }  
}

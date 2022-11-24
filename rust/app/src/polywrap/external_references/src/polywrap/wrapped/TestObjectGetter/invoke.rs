use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use internal::classes::{ TestObjectGetterWrapped };
use external::classes::{ TestObjectGetter };

use internal::classes::{ TestExternalClassWrapped };

use crate::{ TestExternalClass };



pub async fn invoke(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer[0..4].try_into().expect("Method ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
    wrap_manifest::internal::classes::TestObjectGetterMethod::Create =>
        invokeCreateWrapped(data_buffer, external_module),
    wrap_manifest::internal::classes::TestObjectGetterMethod::TestInstanceReceiveReference =>
        invokeTestInstanceReceiveReferenceWrapped(data_buffer, external_module),
    wrap_manifest::internal::classes::TestObjectGetterMethod::TestStaticReceiveReference =>
        invokeTestStaticReceiveReferenceWrapped(data_buffer, external_module),
    _ => panic!(format!("Unknown method: {} on class {}", func_id.to_string(), model.class_name))
  }
}

async fn invokeCreateWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    let args = CreateArgsWrapped.deserialize(buffer, external_module);

    let result = TestObjectGetter.create(
        args.arg,
    ).await;
    
    TestObjectGetterWrapped.serialize(result)
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
async fn invokeTestInstanceReceiveReferenceWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    
    let reference_ptr = u32::from_be_bytes(buffer[0..4].try_into().expect("Reference ptr must be 4 bytes"));
    let data_buffer = &buffer[4..];

    let args = TestInstanceReceiveReferenceArgsWrapped.deserialize(data_buffer, external_module);

    let object = TestObjectGetterWrapped.dereference(reference_ptr);

    let result = object.testInstanceReceiveReference(
        args.arg,
    ).await;

    
    BaseTypeSerialization.serialize<string>(result)
};

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

struct TestInstanceReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestInstanceReceiveReferenceArgsWrapped {
    pub fn new(
        arg: TestExternalClassWrapped,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalWrapModule) -> TestInstanceReceiveReferenceArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestInstanceReceiveReferenceArgs.new(
        
        TestExternalClassWrapped.map_from_serializable(args.arg, external_module),
                
        )
    }  
}
async fn invokeTestStaticReceiveReferenceWrapped(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    let args = TestStaticReceiveReferenceArgsWrapped.deserialize(buffer, external_module);

    let result = TestObjectGetter.testStaticReceiveReference(
        args.arg,
    ).await;
    
    
    BaseTypeSerialization.serialize<string>(result)
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

struct TestStaticReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestStaticReceiveReferenceArgsWrapped {
    pub fn new(
        arg: TestExternalClassWrapped,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalWrapModule) -> TestStaticReceiveReferenceArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestStaticReceiveReferenceArgs.new(
        
        TestExternalClassWrapped.map_from_serializable(args.arg, external_module),
                
        )
    }  
}

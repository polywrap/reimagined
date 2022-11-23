use reim_wrap::{ ExternalModule };
use module::{ WrapManifest };
use internal::classes::{ TestExternalClassWrapped };
use external::classes::{ TestExternalClass };



pub fn invoke(buffer: &[u8], external_module: dyn ExternalModule) -> Vec<u8> {
  let func_id = u32::from_be_bytes(buffer.try_into().expect("Method ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match func_id {
    wrap_manifest::internal::classes::TestExternalClassMethod::Create =>
        invokeCreateWrapped(data_buffer, external_module),
    wrap_manifest::internal::classes::TestExternalClassMethod::TestInstanceMethod =>
        invokeTestInstanceMethodWrapped(data_buffer, external_module),
    wrap_manifest::internal::classes::TestExternalClassMethod::TestStaticMethod =>
        invokeTestStaticMethodWrapped(data_buffer, external_module),
    _ => panic!(format!("Unknown method: {} on class {}", func_id.to_string(), model.class_name))
  }
}

fn invokeCreateWrapped(buffer: &[u8], external_module: dyn ExternalModule) -> Vec<u8> {
    let args = CreateArgsWrapped.deserialize(buffer, external_module);

    let result = TestExternalClass.create(
        args.arg,
    );
    
    TestExternalClassWrapped.serialize(result)
    };

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

struct CreateArgsWrapped {
    pub arg: String,
}

impl CreateArgsWrapped {
    pub fn new(
        arg: String,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalModule) -> CreateArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        CreateArgs.new(
                
        args.arg,
        
        )
    }  
}
fn invokeTestInstanceMethodWrapped(buffer: &[u8], external_module: dyn ExternalModule) -> Vec<u8> {
    
    let reference_ptr = u32::from_be_bytes(buffer.try_into().expect("Reference ptr must be 4 bytes"));
    let data_buffer = &buffer[4..];

    let args = TestInstanceMethodArgsWrapped.deserialize(data_buffer, external_module);

    let object = TestExternalClassWrapped.dereference(reference_ptr);

    let result = object.testInstanceMethod(
        args.arg,
    );

    
    BaseTypeSerialization.serialize<String>(result)
};

struct TestInstanceMethodArgs {
    pub arg: String,
}

impl TestInstanceMethodArgs {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }
}

struct TestInstanceMethodArgsWrapped {
    pub arg: String,
}

impl TestInstanceMethodArgsWrapped {
    pub fn new(
        arg: String,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalModule) -> TestInstanceMethodArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestInstanceMethodArgs.new(
                
        args.arg,
        
        )
    }  
}
fn invokeTestStaticMethodWrapped(buffer: &[u8], external_module: dyn ExternalModule) -> Vec<u8> {
    let args = TestStaticMethodArgsWrapped.deserialize(buffer, external_module);

    let result = TestExternalClass.testStaticMethod(
        args.arg,
    );
    
    
    BaseTypeSerialization.serialize<String>(result)
};

struct TestStaticMethodArgs {
    pub arg: String,
}

impl TestStaticMethodArgs {
    pub fn new(
        arg: String,
    ) -> Self {
        Self {
            arg,
        }
    }
}

struct TestStaticMethodArgsWrapped {
    pub arg: String,
}

impl TestStaticMethodArgsWrapped {
    pub fn new(
        arg: String,
    ) {
        Self {
        arg,
        }
    }

    pub fn deserialize(buffer: Uint8Array, external_module: dyn ExternalModule) -> TestStaticMethodArgs {
        let args = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestStaticMethodArgs.new(
                
        args.arg,
        
        )
    }  
}

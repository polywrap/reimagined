use std::{sync::{Arc, Mutex}, collections::HashMap};
use std::str;
use reim_wrap::{ ExternalModule };
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::polywrap::wrap_manifest::{ WrapManifest };
use crate::polywrap::external::module::{ WrapModule };
use crate::polywrap::external::{ TestExternalClass };


const CLASS_NAME: &str = "TestExternalClass";

struct InstanceWithExternalReferencePtr {
    pub external_reference_ptr: u32,
    pub instance: TestExternalClass
}

impl InstanceWithExternalReferencePtr {
    pub fn new(external_reference_ptr: u32, instance: TestExternalClass) -> Self {
        Self {
            external_reference_ptr,
            instance,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TestExternalClassWrapped {
    pub __referencePtr: u32,
}


static reference_map: Arc<Mutex<HashMap<TestExternalClass, InstanceWithExternalReferencePtr>>> = Arc::new(Mutex::new(HashMap<TestExternalClass, InstanceWithExternalReferencePtr>::new()));

impl TestExternalClassWrapped {
    pub fn new(
        __referencePtr: u32,
    ) -> Self {
        Self {
            __referencePtr,
        }
    }

    pub fn dereference(reference_ptr: TestExternalClass) -> TestExternalClass {
        let reference_map = reference_map.lock().unwrap();
        let object = reference_map.get(reference_ptr);

        if object.is_none() {
            panic!("Could not dereference {}. Not found", CLASS_NAME);
        }

        object.instance
    }

    pub fn delete_reference(reference_ptr: TestExternalClass) {
        let reference_map = reference_map.lock().unwrap();
        let success = reference_map.delete(reference_ptr);

        if success.is_none() {
            panic!("Could not delete reference for {}. Not found", CLASS_NAME);
        }
    }

    pub fn serialize(value: &TestExternalClass) -> &[u8] {
        json!(
            TestExternalClassWrapped::map_to_serializable(value)
        ).as_bytes()
    }

    pub fn map_to_serializable(value: TestExternalClass) -> TestExternalClassWrapped {
        let reference_ptr = value;
        let reference_map = reference_map.lock().unwrap();
        let existing_reference = reference_map.get(reference_ptr);

        if existing_reference.is_none() {
            panic!("Could not dereference {}. Not found", CLASS_NAME);
        }
    
        TestExternalClassWrapped::new(
            existing_reference.external_reference_ptr,

        )
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> TestExternalClass {
        let object = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestExternalClassWrapped::map_from_serializable(object, external_module)
    }

    pub fn map_from_serializable(value: &TestExternalClassWrapped, external_module: Arc<dyn ExternalModule>) -> TestExternalClass {
        let object = TestExternalClass::new(
            value.__referencePtr,
            external_module,

        );

        let reference_ptr = object;
    
        reference_map.set(
            reference_ptr, 
            InstanceWithExternalReferencePtr::new (
                value.__reference_ptr, 
                object
            )
        );  

        object
    }
}

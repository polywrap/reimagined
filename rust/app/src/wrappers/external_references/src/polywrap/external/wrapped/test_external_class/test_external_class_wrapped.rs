use std::{sync::{Arc, Mutex}, collections::HashMap};
use lazy_static::lazy_static;
use std::str;
use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::polywrap::external::TestExternalClass;
use by_address::ByAddress;

const CLASS_NAME: &str = "TestExternalClass";

struct InstanceWithExternalReferencePtr {
    pub external_reference_ptr: u32,
    pub instance: Arc<TestExternalClass>
}

impl InstanceWithExternalReferencePtr {
    pub fn new(external_reference_ptr: u32, instance: Arc<TestExternalClass>) -> Self {
        Self {
            external_reference_ptr,
            instance,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TestExternalClassWrapped {
    pub __reference_ptr: u32,
}

lazy_static! {
    static ref reference_map: Arc<
        Mutex<
            HashMap<
                ByAddress<Arc<TestExternalClass>>, 
                InstanceWithExternalReferencePtr
            >
        >> = Arc::new(Mutex::new(HashMap::new()));
}

impl TestExternalClassWrapped {
    pub fn new(
        __reference_ptr: u32,
    ) -> Self {
        Self {
            __reference_ptr,
        }
    }

    pub fn dereference(reference_ptr: Arc<TestExternalClass>) -> Arc<TestExternalClass> {
        let reference_ptr = ByAddress(reference_ptr);
        let reference_map_mut = reference_map.lock().unwrap();
        let existing_reference = reference_map_mut.get(&reference_ptr);

        if existing_reference.is_none() {
            panic!("Could not dereference {}. Not found", CLASS_NAME);
        }

        Arc::clone(&existing_reference.unwrap().instance)
    }

    pub fn delete_reference(reference_ptr: &Arc<TestExternalClass>) {
        let reference_ptr = Arc::clone(reference_ptr);

        let mut reference_map_mut = reference_map.lock().unwrap();
        let success = reference_map_mut.remove(&ByAddress(reference_ptr));

        if success.is_none() {
            panic!("Could not delete reference for {}. Not found", CLASS_NAME);
        }
    }

    pub fn serialize(value: &Arc<TestExternalClass>) -> Vec<u8> {
        json!(
            TestExternalClassWrapped::map_to_serializable(value)
        )
        .to_string()
        .as_bytes()
        .to_vec()
    }

    pub fn map_to_serializable(value: &Arc<TestExternalClass>) -> TestExternalClassWrapped {
        let value = Arc::clone(value);

        let reference_ptr = ByAddress(value);
        let reference_map_mut = reference_map.lock().unwrap();
        let existing_reference = reference_map_mut.get(&reference_ptr);

        if existing_reference.is_none() {
            panic!("Could not dereference {}. Not found", CLASS_NAME);
        }
    
        TestExternalClassWrapped::new(
            existing_reference.unwrap().external_reference_ptr,

        )
    }

    pub fn deserialize(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Arc<TestExternalClass> {
        let object: TestExternalClassWrapped = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestExternalClassWrapped::map_from_serializable(&object, external_module)
    }

    pub fn map_from_serializable(value: &TestExternalClassWrapped, external_module: Arc<dyn ExternalModule>) -> Arc<TestExternalClass> {
        let object = TestExternalClass::new(
            value.__reference_ptr,
            Arc::clone(&external_module),

        );
        let object = Arc::new(object);

        object
    }
}

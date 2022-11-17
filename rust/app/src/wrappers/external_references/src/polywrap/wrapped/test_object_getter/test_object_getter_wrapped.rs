use std::{sync::{Arc, Mutex}, collections::HashMap};
use std::str;

use reim_wrap::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::TestObjectGetter;

use crate::polywrap::wrapped::test_object_getter::invoke::invoke;

pub const CLASS_NAME: &str = "TestObjectGetter";

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TestObjectGetterWrapped {
    pub __reference_ptr: u32,
} 

static reference_map: Arc<Mutex<HashMap<u32, Arc<TestObjectGetter>>>> = Arc::new(
    Mutex::new(
        HashMap::new()
    )
);
static reference_count: Arc<Mutex<u32>> = Arc::new(Mutex::new(0));

impl TestObjectGetterWrapped {
    pub fn new(
        __reference_ptr: u32,
    ) -> Self {
        Self {
            __reference_ptr,
        }
    }

    pub fn dereference(reference_ptr: u32) -> Arc<TestObjectGetter> {
        let object = reference_map.lock().unwrap().get(&reference_ptr);

        match object {
            Some(object) => Arc::clone(object),
            None => panic!("Reference not found for class: {}", CLASS_NAME),
        }
    }

    pub async fn invoke_method(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {  
        invoke(buffer, external_module).await
    }
    
    pub fn map_to_serializable(value: &Arc<TestObjectGetter>) -> TestObjectGetterWrapped {
        let mut reference_count_mut = reference_count.lock().unwrap();
        let reference_ptr = reference_count_mut.clone();
        *reference_count_mut += 1;

        let mut reference_map_mut = reference_map.lock().unwrap();
        reference_map_mut.insert(reference_ptr, Arc::clone(value));
    
        TestObjectGetterWrapped::new(
            reference_ptr,

        )
    }

    pub fn serialize(value: &Arc<TestObjectGetter>) -> &[u8] {
        json!(
            TestObjectGetterWrapped::map_to_serializable(value)
        )
        .to_string()
        .as_bytes()
    }

    pub fn deserialize(buffer: &[u8]) -> Arc<TestObjectGetter> {
        let object = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");

        TestObjectGetterWrapped::map_from_serializable(&object)
    }

    pub fn map_from_serializable(value: &TestObjectGetterWrapped) -> Arc<TestObjectGetter> {
        TestObjectGetterWrapped::dereference(value.__reference_ptr)
    }
}

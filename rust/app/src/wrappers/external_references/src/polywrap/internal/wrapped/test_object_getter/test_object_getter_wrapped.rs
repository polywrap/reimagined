use std::collections::HashMap;
use std::sync::Arc;
use std::str;
use futures::lock::Mutex;
use lazy_static::lazy_static;
use by_address::ByAddress;

use reim_dt::ExternalModule;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::TestObjectGetter;

use crate::polywrap::internal::wrapped::test_object_getter::invoke::invoke;

pub const CLASS_NAME: &str = "TestObjectGetter";

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TestObjectGetterWrapped {
    pub __reference_ptr: u32,
} 

struct InstanceWithExternalReferencePtr {
    pub external_reference_ptr: u32,
    pub instance: Arc<TestObjectGetter>
}

impl InstanceWithExternalReferencePtr {
    pub fn new(external_reference_ptr: u32, instance: Arc<TestObjectGetter>) -> Self {
        Self {
            external_reference_ptr,
            instance,
        }
    }
}

lazy_static! {
    static ref internal_to_external_map: Arc<
    Mutex<
        HashMap<
            ByAddress<Arc<TestObjectGetter>>, 
            InstanceWithExternalReferencePtr
        >
    >> = Arc::new(Mutex::new(HashMap::new()));
    static ref external_to_internal_map: Arc<
        Mutex<
            HashMap<
                u32, 
                ByAddress<Arc<TestObjectGetter>>
            >
        >> = Arc::new(Mutex::new(HashMap::new()));

    static ref reference_counter: Arc<Mutex<u32>> = Arc::new(Mutex::new(0));
}

impl TestObjectGetterWrapped {
    pub fn new(
        __reference_ptr: u32,
    ) -> Self {
        Self {
            __reference_ptr,
        }
    }

    pub async fn dereference_by_internal_ptr(reference_ptr: Arc<TestObjectGetter>) -> Arc<TestObjectGetter> {
        let reference_ptr = ByAddress(reference_ptr);
        let reference_map_mut = internal_to_external_map.lock().await;
        let existing_reference = reference_map_mut.get(&reference_ptr);

        if existing_reference.is_none() {
            panic!("Could not dereference {}. Not found", CLASS_NAME);
        }

        Arc::clone(&existing_reference.unwrap().instance)
    }

    pub async fn dereference_by_external_ptr(reference_ptr: u32) -> Arc<TestObjectGetter> {
        let reference_map_mut = external_to_internal_map.lock().await;
        let internal_reference_ptr = reference_map_mut.get(&reference_ptr);

        if internal_reference_ptr.is_none() {
            panic!("Could not dereference {}. Not found", CLASS_NAME);
        }

        let reference_map_mut = internal_to_external_map.lock().await;

        Arc::clone(&reference_map_mut.get(internal_reference_ptr.unwrap()).unwrap().instance)
    }

    pub async fn invoke_method(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {  
        invoke(buffer, external_module).await
    }
    
    pub async fn map_to_serializable(value: &Arc<TestObjectGetter>) -> TestObjectGetterWrapped {
        let mut reference_counter_mut = reference_counter.lock().await;
        *reference_counter_mut += 1;
        
        let mut reference_map_mut = internal_to_external_map.lock().await;
        let reference_ptr = ByAddress(Arc::clone(&value));

        reference_map_mut.insert(
            reference_ptr,
            InstanceWithExternalReferencePtr {
                external_reference_ptr: *reference_counter_mut,
                instance: Arc::clone(&value),
            }
        );

        let mut reference_map_mut = external_to_internal_map.lock().await;
        reference_map_mut.insert(
            *reference_counter_mut,
            ByAddress(Arc::clone(&value)),
        );

        TestObjectGetterWrapped::new(
            *reference_counter_mut,
        )
    }

    pub async fn serialize(value: &Arc<TestObjectGetter>) -> Vec<u8> {
        json!(
            TestObjectGetterWrapped::map_to_serializable(value).await
        )
        .to_string()
        .as_bytes()
        .to_vec()
    }

    pub async fn deserialize(buffer: &[u8]) -> Arc<TestObjectGetter> {
        let object = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");

        TestObjectGetterWrapped::map_from_serializable(&object).await
    }

    pub async fn map_from_serializable(value: &TestObjectGetterWrapped) -> Arc<TestObjectGetter> {
        TestObjectGetterWrapped::dereference_by_external_ptr(value.__reference_ptr).await
    }
}

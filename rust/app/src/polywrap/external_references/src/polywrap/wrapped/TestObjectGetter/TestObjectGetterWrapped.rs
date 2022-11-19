use std::{sync::{Arc, Mutex}};
use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use external_module::{ WrapModule };
use external::{ TestObjectGetter };
use wrapped::{ TestExternalClassWrapped };


const CLASS_NAME: str = "TestObjectGetter";

struct InstanceWithExternalReferencePtr {
    pub external_reference_ptr: u32,
    pub instance: TestObjectGetter
}

impl InstanceWithExternalReferencePtr {
    pub fn new(external_reference_ptr: u32, instance: TestObjectGetter) -> Self {
        Self {
            external_reference_ptr,
            instance,
        }
    }
}

struct TestObjectGetterWrapped {
    pub __referencePtr: u32,
}


static reference_map: Arc<Mutex<HashMap<TestObjectGetter, InstanceWithExternalReferencePtr>>> = Arc::new(Mutex::new(HashMap<TestObjectGetter, InstanceWithExternalReferencePtr>::new()));

impl TestObjectGetterWrapped {
    pub fn new(
        __referencePtr: u32,
    ) -> Self {
        Self {
            __referencePtr,
        }
    }

    pub fn dereference(reference_ptr: TestObjectGetter) -> TestObjectGetter {
        let reference_map = reference_map.lock().unwrap();
        let object = reference_map.get(reference_ptr);

        if object.is_none() {
            panic!(format!("Could not dereference {}. Not found", CLASS_NAME));
        }

        object.instance
    }

    pub fn delete_reference(reference_ptr: TestObjectGetter) {
        let reference_map = reference_map.lock().unwrap();
        let success = reference_map.delete(reference_ptr);

        if success.is_none() {
        panic!(format!("Could not delete reference for {}. Not found", CLASS_NAME));
        }
    }

    pub fn serialize(value: TestObjectGetter) -> Vec<u8> {
        json!(
            TestObjectGetterWrapped.map_from_serializable(value)
        ).as_bytes()
    }

    pub fn map_to_serializable(value: TestObjectGetter) -> TestObjectGetterWrapped {
        let reference_ptr = value;
        let reference_map = reference_map.lock().unwrap();
        let existing_reference = reference_map.get(reference_ptr);

        if existing_reference.is_none() {
            panic!(format!("Could not dereference {}. Not found", CLASS_NAME));
        }
    
        TestObjectGetterWrapped.new(
            existing_reference.external_reference_ptr,

        )
    }

    pub fn deserialize(buffer: &[u8], external_module: &dyn ExternalWrapModule) -> TestObjectGetter {
        let object = serde_json::from_str(
            str::from_utf8(buf).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");
    
        TestObjectGetterWrapped.map_from_serializable(object, external_module, external_module)
    }

    pub fn map_from_serializable(value: TestObjectGetterWrapped, external_module: &dyn ExternalWrapModule) -> TestObjectGetter {
        let object = TestObjectGetter.new(
            value.__referencePtr,
            external_module,

        );

        let reference_ptr = object;
    
        TestObjectGetterWrapped.reference_map.set(
            reference_ptr, 
            InstanceWithExternalReferencePtr.new (
                value.__reference_ptr, 
                object
            )
        );  

        object
    }
}

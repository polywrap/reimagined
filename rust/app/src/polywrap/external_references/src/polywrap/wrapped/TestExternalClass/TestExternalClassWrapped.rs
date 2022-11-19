use reim_wrap::{ ExternalWrapModule };
use crate::{ TestExternalClass };

use invoke::{ invoke };

const CLASS_NAME: str = "TestExternalClass";

struct TestExternalClassWrapped {
    pub __referencePtr: u32,
} 

static reference_map: Arc<Mutex<HashMap<u32, TestExternalClass>>> = Arc::new(Mutex::new(HashMap<u32, TestExternalClass>::new()));
static reference_count: Arc<Mutex<u32>> = Arc::new(Mutex::new(0));

impl TestExternalClassWrapped {
    pub fn new(
         __referencePtr: u32,
    ) -> Self {
        Self {
            __referencePtr,
        }
    }

    pub fn dereference(reference_ptr: u32) -> TestExternalClass {
        let reference_map = reference_map.lock().unwrap();
        let object = reference_map.get(reference_ptr);

        match object {
            Some(object) => object,
            None => panic!(format!("Reference not found for class: {}", CLASS_NAME)),
        }
    }

    pub fn invoke_method(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {  
        invoke(buffer, external_module)
    }
    
    pub fn map_to_serializable(value: TestExternalClass) -> TestExternalClassWrapped {
        let mut reference_count = reference_count.lock().unwrap();
        let reference_ptr = reference_count;
        *reference_count += 1;

        reference_map.set(reference_ptr, value);
    
        TestExternalClassWrapped.new(
            reference_ptr,

        )
    }

    pub fn serialize(value: TestExternalClass) -> Vec<u8> {
        json!(
            TestExternalClassWrapped.map_to_serializable(value)
        ).as_bytes()
    }

    pub fn deserialize(buffer: &[u8]) -> TestExternalClass {
        let object = serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted");

        TestExternalClassWrapped.map_from_serializable(object)
    }

    pub fn map_from_serializable(value: TestExternalClassWrapped) -> TestExternalClass {
        TestExternalClassWrapped.dereference(value.__referencePtr)
    }
}

use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };

use wrapped::{ TestExternalClassWrapped };


pub async fn invoke_class_method(buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
  let class_id = u32::from_be_bytes(buffer.try_into().expect("Class ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match class_id {
    
    
    
    WrapManifest::Internal::Class::TestExternalClass =>
        TestExternalClassWrapped.invoke_method(data_buffer, external_module),
    
    _ => panic!("Unknown class ID: ".to_string() + &class_id.to_string()),
  }
}

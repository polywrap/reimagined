use std::sync::Arc;

use reim_dt::ExternalModule;
use crate::polywrap::wrap::wrap_manifest;
use crate::polywrap::internal::wrapped::TestObjectGetterWrapped;

pub fn invoke_class_method(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let class_id = u32::from_be_bytes(buffer.try_into().expect("Class ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match class_id {
    
    x if x == wrap_manifest::internal::Class::TestObjectGetter as u32 =>
        TestObjectGetterWrapped::invoke_method(data_buffer, external_module),
    
    
    
    _ => panic!("Unknown class ID: {}", class_id),
  }
}

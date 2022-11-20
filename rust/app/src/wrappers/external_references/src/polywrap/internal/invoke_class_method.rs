use std::sync::Arc;

use reim_wrap::ExternalModule;
use crate::polywrap::wrap_manifest::WrapManifest;
use crate::polywrap::internal::wrapped::TestObjectGetterWrapped;

pub async fn invoke_class_method(buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
  let class_id = u32::from_be_bytes(buffer.try_into().expect("Class ID must be 4 bytes"));
  let data_buffer = &buffer[4..];

  match class_id {
    
    x if x == WrapManifest::Internal::Class::TestObjectGetter as u32 =>
        TestObjectGetterWrapped::invoke_method(data_buffer, external_module).await,
    
    
    
    _ => panic!("Unknown class ID: {}", class_id),
  }
}

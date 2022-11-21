use std::sync::Arc;

use async_trait::async_trait;
use reim_dt::{ ExternalModule, InternalModule };
use crate::polywrap::internal::{ invoke_global_function, invoke_class_method };
use crate::polywrap::resources::InternalResource;

pub struct InternalWrapModule {}

impl InternalWrapModule {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl InternalModule for InternalWrapModule {
  async fn receive(&self, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
    let resource = u32::from_be_bytes(buffer.try_into().expect("Resource ID must be 4 bytes"));
    let data_buffer = &buffer[4..];

    match resource {
      x if x == InternalResource::InvokeGlobalFunction as u32 => invoke_global_function(data_buffer, external_module).await,
      x if x == InternalResource::InvokeClassMethod as u32 => invoke_class_method(data_buffer, external_module).await,
      _ => panic!("Unknown resource: {}", resource.to_string()),
    }
  }
}

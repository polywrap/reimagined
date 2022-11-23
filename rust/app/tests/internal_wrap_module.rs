use std::sync::Arc;

use async_trait::async_trait;
use reim_dt::{ ExternalModule, InternalModule };
pub struct InternalWrapModule {}

impl InternalWrapModule {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl InternalModule for InternalWrapModule {
  async fn receive(&self, buffer: &[u8], _external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
    let resource = u32::from_be_bytes(buffer[0..4].try_into().expect("Resource ID must be 4 bytes"));
    let data_buffer = &buffer[4..];

    match resource {
      x if x == 1337 as u32 => {
        data_buffer.to_vec()
    },
      _ => panic!("Unknown resource: {}", resource.to_string()),
    }
  }
}

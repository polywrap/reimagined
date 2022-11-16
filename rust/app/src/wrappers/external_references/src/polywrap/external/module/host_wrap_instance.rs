use std::sync::Arc;
use async_trait::async_trait;
use reim_wrap::{ ExternalModule };
use crate::polywrap::dt::{ send };

struct HostModule {}

impl HostModule {
    pub fn new() -> Self {
        HostModule {}
    }
}


#[async_trait]
impl ExternalModule for HostModule {
  async fn invoke_resource(self: Arc<Self>, resource: u32, buffer: &[u8]) -> Vec<u8> {
    send(
        [&resource.to_be_bytes(), buffer].concat()
    )
  }
}

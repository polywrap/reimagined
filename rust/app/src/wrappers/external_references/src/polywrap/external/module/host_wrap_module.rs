use std::sync::Arc;
use async_trait::async_trait;
use reim_wrap::ExternalModule;
use reim_wrap_wasm::send;

pub struct HostWrapModule;

impl HostWrapModule {
    pub fn new() -> Self {
        Self {
        }
    }
}

#[async_trait]
impl ExternalModule for HostWrapModule {
    async fn invoke_resource(self: Arc<Self>, resource: u32, buffer: &[u8]) -> Vec<u8> {
        send(
            &[&resource.to_be_bytes(), buffer].concat()
        )
    }
}

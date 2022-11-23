use std::sync::Arc;
use async_trait::async_trait;
use reim_dt::ExternalModule;

use crate::send::send;

pub struct HostModule;

impl HostModule {
    pub fn new() -> Self {
        Self {
        }
    }
}

#[async_trait]
impl ExternalModule for HostModule {
    async fn send(self: Arc<Self>, buffer: &[u8]) -> Vec<u8> {
        send(buffer)
    }
}

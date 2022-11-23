use std::sync::Arc;
use reim_dt::ExternalModule;

use crate::send::send;

pub struct HostModule;

impl HostModule {
    pub fn new() -> Self {
        Self {
        }
    }
}

impl ExternalModule for HostModule {
    fn send(self: Arc<Self>, buffer: &[u8]) -> Vec<u8> {
        send(buffer)
    }
}

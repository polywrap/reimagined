use std::sync::Arc;

use async_trait::async_trait;

use crate::ExternalModule;

#[async_trait]
pub trait InternalModule: Send + Sync {
    async fn invoke_resource(&self, resource: u32, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8>;
}

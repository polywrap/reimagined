use std::sync::Arc;

use async_trait::async_trait;

#[async_trait]
pub trait ExternalModule: Send + Sync {
    async fn invoke_resource(self: Arc<Self>, resource: u32, buffer: &[u8]) -> Vec<u8>;
}

use std::sync::Arc;

use async_trait::async_trait;

#[async_trait]
pub trait ExternalModule: Send + Sync {
    async fn send(self: Arc<Self>, buffer: &[u8]) -> Vec<u8>;
}

use std::sync::Arc;

use async_trait::async_trait;

use crate::ExternalModule;

#[async_trait]
pub trait InternalModule: Send + Sync {
    async fn receive(&self, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8>;
}

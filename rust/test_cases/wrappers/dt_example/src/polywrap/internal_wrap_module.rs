use std::sync::Arc;

use async_trait::async_trait;
use reim_dt::{ ExternalModule, InternalModule };
pub struct InternalWrapModule {}

#[async_trait]
impl InternalModule for InternalWrapModule {
    async fn receive(&self, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
        external_module.send(buffer).await
    }
}

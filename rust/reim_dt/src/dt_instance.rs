use std::sync::Arc;

use async_trait::async_trait;

use crate::Receiver;

#[async_trait]
pub trait DtInstance: Send + Sync {
    async fn send(&mut self, buffer: &[u8], on_receive: Arc<dyn Receiver>) -> Vec<u8>;
}

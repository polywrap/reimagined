use async_trait::async_trait;

#[async_trait]
pub trait Receiver: Send + Sync {
    async fn receive(&self, buffer: &[u8]) -> Vec<u8>;
} 

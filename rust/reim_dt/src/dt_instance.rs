use std::{pin::Pin, future::Future};

use async_trait::async_trait;

#[async_trait]
pub trait DtInstance {
    async fn send(&mut self, buffer: &[u8], on_receive: Box<dyn Fn(Vec<u8>) -> Pin<Box<dyn Future<Output = Vec<u8>> + Send + Sync>> + Send + Sync>) -> Vec<u8>;
}

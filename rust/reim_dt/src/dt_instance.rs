use async_trait::async_trait;

use crate::on_receive_fn::OnReceiveFn;

#[async_trait]
pub trait DtInstance {
    async fn send(&mut self, buffer: &[u8], on_receive: OnReceiveFn) -> Vec<u8>;
}

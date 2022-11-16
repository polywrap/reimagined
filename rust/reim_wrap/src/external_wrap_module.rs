use async_trait::async_trait;

#[async_trait]
pub trait ExternalModule {
    async fn invoke_resource(&mut self, resource: u32, buffer: &[u8]) -> Vec<u8>;
}

use async_trait::async_trait;

#[async_trait]
pub trait ExternalWrapModule {
  async fn invoke_resource(&self, resource: u32, buffer: &[u8]) -> Vec<u8>;
}

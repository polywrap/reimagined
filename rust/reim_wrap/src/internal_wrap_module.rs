use async_trait::async_trait;

use crate::ExternalWrapModule;

#[async_trait]
pub trait InternalWrapModule {
    async fn invoke_resource(&self, resource: u32, buffer: &[u8], external_module: &dyn ExternalWrapModule) -> Vec<u8>;
}
  
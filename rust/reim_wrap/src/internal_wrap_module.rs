use async_trait::async_trait;

#[async_trait]
pub trait InternalModule {
    async fn invoke_resource(self, resource: u32, buffer: Vec<u8>) -> Vec<u8>;
}

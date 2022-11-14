use async_trait::async_trait;
use reim_dt::DtInstance;

use crate::{InternalWrapModule, ExternalWrapModule};

pub struct WrapperModule {
    internal_module: Arc<dyn InternalWrapModule>,
    dt_instance: Arc<dyn DtInstance>,
}

impl WrapperModule {
    pub fn new(dt_instance: Box<dyn DtInstance>, internal_module: Box<dyn InternalWrapModule>) -> Self {
        Self {
            internal_module,
            dt_instance,
        }
    }
}

#[async_trait]
impl ExternalWrapModule for WrapperModule {
    async fn invoke_resource(&self, resource: u32, buffer: &[u8]) -> Vec<u8> {
        self.dt_instance.send(
            &[&resource.to_be_bytes(), buffer].concat(),
            Box::new(
                |buffer: &[u8]| {
                    let resource = u32::from_be_bytes(buffer.try_into().expect("Resource ID must be 4 bytes"));
                    let data_buffer = &buffer[4..];
                    self.internal_module.invoke_resource(resource, data_buffer, self)
                }
            )
        )
        .await
    }
}

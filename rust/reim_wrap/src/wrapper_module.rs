
use std::sync::Arc;

use async_trait::async_trait;
use reim_dt::{DtInstance, Receiver};
use tokio::sync::Mutex;
use crate::{internal_wrap_module::InternalModule, ExternalModule};

pub struct WrapperModule {
    dt_instance: Arc<Mutex<dyn DtInstance>>,
    internal_module: Arc<Mutex<dyn InternalModule>>,
}

impl WrapperModule {
    pub fn new(
        dt_instance: Arc<Mutex<dyn DtInstance>>, 
        internal_module: Arc<Mutex<dyn InternalModule>>
    ) -> Self {
        Self {
            internal_module,
            dt_instance,
        }
    }
}

struct ReceiverWithModule {
    internal_module: Arc<Mutex<dyn InternalModule>>,
    external_module: Arc<dyn ExternalModule>,
}

impl ReceiverWithModule {
    pub fn new(internal_module: Arc<Mutex<dyn InternalModule>>, external_module: Arc<dyn ExternalModule>) -> Self {
        Self {
            internal_module,
            external_module,
        }
    }
}

#[async_trait]
impl Receiver for ReceiverWithModule {
    async fn receive(&self, buffer: &[u8]) -> Vec<u8> {
        let internal_module = self.internal_module.lock().await;

        let resource = u32::from_be_bytes(buffer.try_into().expect("Resource must be 4 bytes"));
        let data_buffer = &buffer[4..];

        internal_module.invoke_resource(resource, data_buffer, Arc::clone(&self.external_module)).await
    }
}

#[async_trait]
impl ExternalModule for WrapperModule {
    async fn invoke_resource(self: Arc<Self>, resource: u32, buffer: &[u8]) -> Vec<u8> {
        let internal_module = self.internal_module.clone();
        let mut dt_instance = self.dt_instance.lock().await;
        
        let external_module = Arc::clone(&self);
        
        dt_instance.send(
            &[&resource.to_be_bytes(), buffer].concat(),
            Arc::new(
                ReceiverWithModule::new(
                    internal_module,
                    external_module
                )
            )
        )
        .await
    }
}

use std::sync::Arc;

use async_trait::async_trait;
use reim_dt::{DtModule, Receiver};
use tokio::sync::Mutex;
use crate::{internal_module::InternalModule, ExternalModule};

pub struct WrapperModule {
    dt_instance: Arc<Mutex<dyn DtModule>>,
    internal_module: Arc<Mutex<dyn InternalModule>>,
}

impl WrapperModule {
    pub fn new(
        dt_instance: Arc<Mutex<dyn DtModule>>, 
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

        internal_module.receive(buffer, Arc::clone(&self.external_module)).await
    }
}

#[async_trait]
impl ExternalModule for WrapperModule {
    async fn send(self: Arc<Self>, buffer: &[u8]) -> Vec<u8> {
        let internal_module = self.internal_module.clone();
        let mut dt_instance = self.dt_instance.lock().await;
        
        let external_module = Arc::clone(&self);
        
        let receiver: Arc<dyn Receiver> = Arc::new(ReceiverWithModule::new(internal_module, external_module));

        dt_instance.send(
            buffer,
            &receiver
        )
        .await
    }
}

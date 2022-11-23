use std::sync::Arc;

use async_trait::async_trait;
use futures::lock::Mutex;
use reim_dt_async::{InternalModule, ExternalModule};

use crate::{DtModule, Receiver};

pub struct WrapperModule {
    dt_module: Arc<Mutex<dyn DtModule>>,
    internal_module: Arc<Mutex<dyn InternalModule>>,
}

impl WrapperModule {
    pub fn new(
        dt_module: Arc<Mutex<dyn DtModule>>, 
        internal_module: Arc<Mutex<dyn InternalModule>>
    ) -> Self {
        Self {
            internal_module,
            dt_module,
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
        let mut dt_module = self.dt_module.lock().await;
        
        let external_module = Arc::clone(&self);
        
        let receiver: Arc<dyn Receiver> = Arc::new(ReceiverWithModule::new(internal_module, external_module));

        dt_module.send(
            buffer,
            &receiver
        )
        .await
    }
}

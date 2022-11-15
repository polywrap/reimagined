
use std::{sync::{Arc, Mutex}, pin::Pin, future::Future};

use async_trait::async_trait;
use reim_dt::{DtInstance, OnReceiveFn};
use crate::{internal_wrap_module::InternalModule, ExternalModule};

pub struct WrapperModule {
    dt_instance: Box<dyn DtInstance + Send>,
    internal_module: Box<dyn InternalModule + Send>,
}

impl WrapperModule {
    pub fn new(dt_instance: Box<dyn DtInstance + Send>, internal_module: Box<dyn InternalModule + Send>) -> Self {
        Self {
            internal_module,
            dt_instance,
        }
    }
}

#[async_trait]
impl ExternalModule for WrapperModule {
    async fn invoke_resource(&self, resource: u32, buffer: &[u8]) -> Vec<u8> {
        let buffer2 = buffer.to_vec();
        let test: OnReceiveFn = Box::new(
            |buffer: Vec<u8>| Box::pin(async { 
                let resource = u32::from_be_bytes(buffer.try_into().expect("Resource ID must be 4 bytes"));
                let data_buffer = buffer;
                // let internal_module = internal_module.lock().unwrap();
                let x: Pin<Box<dyn Future<Output = Vec<u8>> + Send>> = self.internal_module.invoke_resource(resource, data_buffer.to_vec());
                x.await
            })
        );

        // let dt_instance = Arc::clone(&self.dt_instance);
        // let dt_instance = dt_instance.lock().unwrap();

        let x: Vec<u8> = self.dt_instance.send(
            &[&resource.to_be_bytes(), &buffer2[..]].concat(),
            test
        )
        .await;

        vec![]
    }
}

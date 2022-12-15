use std::sync::Arc;
use async_trait::async_trait;

use reim_dt::{ ExternalModule, InternalModule };
use crate::bindings::global_functions::polywrap::wrap::InternalResource;

use super::{ invoke_global_function };

pub struct InternalWrapModule {}

#[async_trait]
impl InternalModule for InternalWrapModule {
    async fn receive(&self, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
        let resource = u32::from_be_bytes(buffer[0..4].try_into().expect("Resource ID must be 4 bytes"));
        let data_buffer = &buffer[4..];

        match resource {
            x if x == InternalResource::Log as u32 => {
                println!("{}", String::from_utf8(data_buffer.to_vec()).expect("Could not convert buffer to string"));
                vec![]
            },
            x if x == InternalResource::InvokeGlobalFunction as u32 => invoke_global_function(data_buffer, external_module).await,
            _ => panic!("Unknown resource: {}", resource.to_string()),
        }
    }
}

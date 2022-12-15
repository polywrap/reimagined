use std::sync::Arc;
use async_trait::async_trait;

use reim_dt::{ ExternalModule, InternalModule };
use crate::polywrap::internal::{ invoke_global_function };

use super::log::log;

pub struct InternalWrapModule {}

#[async_trait]
impl InternalModule for InternalWrapModule {
    async fn receive(&self, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
        let (function_name, data_buffer) = deserialize(buffer);

        log(&format!("Received {:?} => {:?}", function_name, data_buffer), Arc::clone(&external_module)).await;

        invoke_global_function(&function_name, data_buffer, external_module).await
    }
}

fn deserialize(buffer: &[u8]) -> (String, &[u8]) {
    let function_name_length = u16::from_be_bytes(buffer[0..2].try_into().expect("Function length must be 2 bytes"));
    let end_index = 2 + function_name_length as usize;
    let function_name = String::from_utf8_lossy(
    buffer[2..end_index]
        .try_into()
        .expect(format!("Function name must be {} bytes", function_name_length).as_str())
    );
    let data_buffer = &buffer[end_index..];

    (function_name.to_string(), data_buffer)
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;
    use futures::lock::Mutex;
    use async_trait::async_trait;

    use reim_dt::ExternalModule;
    use reim_host_dt::WrapperModule;
    use reim_host_dt_wasm::{wasm_runtime::instance::WasmModule, DtWasmModule};

    use reim_dt::InternalModule;
    
    struct InternalWrapModule {}

    #[async_trait]
    impl InternalModule for InternalWrapModule {
      async fn receive(&self, buffer: &[u8], _external_module: Arc<dyn ExternalModule>) -> Vec<u8> {
        buffer.to_vec()
      }
    }

    #[tokio::test]
    async fn dt_example() {
        let message_to_send = "Hello World".to_string();

        let bytes = include_bytes!("../../test_cases/wrappers/dt_example/build/wrap.wasm").to_vec();
        let dt_module = Arc::new(Mutex::new(DtWasmModule::from_bytes(&bytes).await));
      
        let internal_module = Arc::new(Mutex::new(InternalWrapModule {}));

        let wrapper = Arc::new(WrapperModule::new(dt_module, internal_module));
    
        let result_buffer = wrapper.send(message_to_send.as_bytes()).await;

        assert_eq!(String::from_utf8(result_buffer), Ok(message_to_send));
    }
}

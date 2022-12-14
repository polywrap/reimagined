mod bindings;

#[cfg(test)]
mod tests {
    use std::sync::Arc;
    use futures::lock::Mutex;

    use reim_host_dt::WrapperModule;
    use reim_host_dt_wasm::DtWasmModule;
    use crate::bindings::global_functions::polywrap::internal::internal_wrap_module::InternalWrapModule;
    use crate::bindings::global_functions::polywrap::external::module::wrap_module::WrapModule;
    use crate::bindings::global_functions::polywrap::external::test_wrapper_global_function;
    
    async fn load_wrapper(buffer: &[u8]) -> Arc<WrapperModule> {
        let dt_module = Arc::new(Mutex::new(DtWasmModule::from_bytes(&buffer).await));
      
        let internal_module = Arc::new(Mutex::new(InternalWrapModule {}));

        Arc::new(WrapperModule::new(dt_module, internal_module))
    }

    #[tokio::test]
    async fn global_functions_static_call() {
        let message_to_send = "Hello World".to_string();

        let buffer = include_bytes!("../../test_cases/wrappers/global_functions/build/wrap.wasm");
        let wrapper = load_wrapper(buffer).await;

        WrapModule::connect(wrapper).await;
    
        let result = test_wrapper_global_function(message_to_send.to_string()).await;

        assert_eq!(result, message_to_send);
    }

    #[tokio::test]
    async fn global_functions_call_from_import() {
        let message_to_send = "Hello World".to_string();

        let buffer = include_bytes!("../../test_cases/wrappers/global_functions/build/wrap.wasm");
        let wrapper = load_wrapper(buffer).await;

        let imports = WrapModule::import(wrapper);
    
        let result = imports.test_wrapper_global_function(message_to_send.to_string()).await;

        assert_eq!(result, message_to_send);
    }
}

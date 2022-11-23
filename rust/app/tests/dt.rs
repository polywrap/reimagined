pub mod internal_wrap_module;
fn main() {
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use reim_dt_async::ExternalModule;
    use reim_host_dt::{WrapperModule};
    use reim_host_dt_wasm::{wasm_runtime::instance::WasmModule, DtWasmModule};
    use crate::internal_wrap_module::InternalWrapModule;
    use futures::lock::Mutex;

    #[tokio::test]
    async fn dt_sanity() {
        let bytes = include_bytes!("./dt/dt_example/build/wrap.wasm").to_vec();
        let dt_module = Arc::new(Mutex::new(DtWasmModule::new(WasmModule::Bytes(bytes)).await));
        let internal_module = Arc::new(Mutex::new(InternalWrapModule::new()));
        let wrapper: WrapperModule = WrapperModule::new(dt_module, internal_module);
        
        let buffer = [
            &(1338 as u32).to_be_bytes()[..],
            &"Hello, world!".as_bytes(),
        ].concat();

        let wrapper = Arc::new(wrapper);
        let result_buffer = wrapper.send(&buffer).await;

        println!("Return Log: {}", String::from_utf8(result_buffer.to_vec()).unwrap());

        panic!("LOL");
    }
}
use std::sync::Arc;
use lazy_static::lazy_static;
use futures::lock::Mutex;
use reim_dt::ExternalModule;

lazy_static! {
    pub static ref EXTERNAL_WRAP_MODULE: Arc<Mutex<Option<Arc<dyn ExternalModule>>>> = Arc::new(Mutex::new(None));
}

pub async fn get_external_module_or_panic() -> Arc<dyn ExternalModule> {
    let external_module = EXTERNAL_WRAP_MODULE.lock().await;

    if external_module.is_none() {
        panic!("connect() must be called before using this module");
    }

    let external_module = Arc::clone(external_module.as_ref().unwrap());

    external_module
}

pub async fn set_external_module(external_module: Arc<dyn ExternalModule>) {
    let mut global_external_module = EXTERNAL_WRAP_MODULE.lock().await;

    *global_external_module = Some(Arc::clone(&external_module));
}

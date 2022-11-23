use std::sync::Arc;
use crate::ExternalModule;

pub trait InternalModule {
    fn receive(&self, buffer: &[u8], external_module: Arc<dyn ExternalModule>) -> Vec<u8>;
}

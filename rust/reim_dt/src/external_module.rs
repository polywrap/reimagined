use std::sync::Arc;

pub trait ExternalModule {
    fn send(self: Arc<Self>, buffer: &[u8]) -> Vec<u8>;
}

pub trait DtInstance {
    fn send(&self, buffer: &[u8], on_receive: &dyn Fn(&[u8]) -> Vec<u8>) -> Vec<u8>;
}
  
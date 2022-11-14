pub trait ExternalWrapModule {
  fn invoke_resource(&self, resource: u32, buffer: &[u8]) -> Vec<u8>;
}

use crate::ExternalWrapModule;

pub trait InternalWrapModule {
    fn invoke_resource(&self, resource: u32, buffer: &[u8], external_module: &dyn ExternalWrapModule) -> Vec<u8>;
}
  
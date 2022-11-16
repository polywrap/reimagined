use reim_wrap::{ ExternalWrapModule, InternalWrapModule };
use internal::global_functions::{ invoke as invoke_global_function };
use internal::classes::{ invoke_class_method };
use dt::{ InternalResource };

struct InternalModule {}

impl InternalModule {
    pub fn new() -> Self {
        InternalModule {}
    }
}

impl InternalWrapModule for InternalModule {
  async fn invoke_resource(&self, resource: u32, buffer: &[u8], external_module: dyn ExternalWrapModule) -> Vec<u8> {
    match resource {
      InternalResource::InvokeGlobalFunction => invoke_global_function(buffer, external_module),
      InternalResource::InvokeClassMethod => invoke_class_method(buffer, external_module),
      _ => panic!("Unknown resource: ".to_string() + &resource.to_string()),
    }
  }
}

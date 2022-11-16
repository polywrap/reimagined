use crate::polywrap::dt::imports::{ __dt_fill_send_result, __dt_send };
use crate::polywrap::external::module::WrapModule::external_wrap_module;
use crate::polywrap::external::module::WrapModule::{ InternalWrapInstance, HostWrapInstance };

pub fn receive(buffer: &[u8]) -> u32 {  
    let external_module = HostWrapInstance::new();
    external_wrap_module = external_module;

    let resource = u32::from_be_bytes(buffer.try_into().expect("Resource ID must be 4 bytes"));
    let data_buffer = &buffer[4..];
    
    let result = InternalWrapInstance::new().invokeResource(resource, data_buffer, external_module);

    let tmp = [
        &result.len().to_be_bytes(), 
        &result
    ].concat();

    return changetype<u32>(tmp);
}

pub fn send(buffer: &[u8]) -> Vec<u8> {
  let result_len = __dt_send(changetype<u32>(buffer), buffer.len() as u32);

  if result_len == 0 {
    return vec![];
  }

  let result_buffer = Vec::new(result_len);

  __dt_fill_send_result(changetype<u32>(resultBuffer));

  result_buffer
}

use std::sync::Arc;
use reim_wrap::{ InternalModule };

use crate::polywrap::dt::imports::{ __dt_fill_send_result, __dt_send };
use crate::polywrap::external::module::wrap_module::external_wrap_module;
use crate::polywrap::external::module::internal_wrap_module::*;
use crate::polywrap::external::module::host_wrap_module::HostWrapModule;
use crate::polywrap::dt::malloc::alloc;

pub fn receive(buffer: &[u8]) -> u32 {  
    let external_module = Arc::new(HostWrapModule::new());
    external_wrap_module = Some(external_module);

    let resource = u32::from_be_bytes(buffer.try_into().expect("Resource ID must be 4 bytes"));
    let data_buffer = &buffer[4..];
    
    let result = InternalWrapModule::new()
        .invoke_resource(resource, data_buffer, external_module);

    let tmp = [
        &result.len().to_be_bytes(), 
        &result
    ].concat();

    return changetype<u32>(tmp);
}

pub fn send(buffer: &[u8]) -> Vec<u8> {
  let result_len = unsafe {
    __dt_send(buffer.as_ptr() as u32, buffer.len() as u32)
  };

  if result_len == 0 {
    return vec![];
  }

  let result_buffer_ptr = alloc(result_len as usize);
  unsafe { __dt_fill_send_result(result_buffer_ptr as u32) };

  let result_buffer = unsafe { Vec::from_raw_parts(result_buffer_ptr, result_len as usize, result_len as usize) };

  result_buffer
}

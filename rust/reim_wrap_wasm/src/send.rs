use crate::{malloc::*, imports::{__dt_fill_send_result, __dt_send}};

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

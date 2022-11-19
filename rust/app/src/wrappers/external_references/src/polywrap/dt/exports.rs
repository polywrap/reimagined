use crate::polywrap::dt::malloc::alloc;
use crate::polywrap::dt::abort::*;

#[no_mangle]
pub extern "C" fn _dt_receive(input_buffer_len: u32) -> u32 {
    wrap_abort_setup();
   
    let input_buffer_ptr = alloc(input_buffer_len as usize);

    unsafe { __dt_fill_input_buffer(input_buffer_ptr as u32) };

    let input_buffer =
        unsafe { Vec::from_raw_parts(input_buffer_ptr, input_buffer_len as usize, input_buffer_len as usize) };

    receive(&input_buffer[..])
}

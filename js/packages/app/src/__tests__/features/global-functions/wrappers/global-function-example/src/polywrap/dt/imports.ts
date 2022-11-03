@external("wrap", "__dt_fill_input_buffer")
export declare function __dt_fill_input_buffer(buffer_ptr: u32): void; 

@external("wrap", "__dt_send")
export declare function __dt_send(buffer_ptr: u32, buffer_len: u32): u32;

@external("wrap", "__dt_fill_send_result")
export declare function __dt_fill_send_result(buffer_ptr: u32): void;

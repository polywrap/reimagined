@external("wrap", "__wrap_invoke_host")
export declare function __wrap_invoke_host(buffer_ptr: u64, buffer_len: u64): void;

@external("wrap", "__wrap_return_invoke_wasm_result")
export declare function __wrap_return_invoke_wasm_result(buffer_ptr: u64, buffer_len: u64): void;

@external("wrap", "__wrap_fill_input_buffer")
export declare function __wrap_fill_input_buffer(buffer_ptr: u64): void;

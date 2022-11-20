#[link(wasm_import_module = "wrap")]
extern "C" {
    #[link_name = "__dt_fill_input_buffer"]
    pub fn __dt_fill_input_buffer(buffer_ptr: u32);

    #[link_name = "__dt_send"]
    pub fn __dt_send(buffer_ptr: u32, buffer_len: u32) -> u32;
    
    #[link_name = "__dt_fill_send_result"]
    pub fn __dt_fill_send_result(
        buffer_ptr: u32
    );
}

#[link(wasm_import_module = "wrap")]
extern "C" {
    /// Get Abort Arguments
    #[link_name = "__wrap_abort"]
    pub fn __wrap_abort(
        msg_ptr: u32,
        msg_len: u32,
        file_ptr: u32,
        file_len: u32,
        line: u32,
        column: u32,
    );
}

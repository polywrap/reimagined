pub fn serialize_invocation_buffer(function_name: &str, buffer: &[u8]) -> Vec<u8> {
    [
        &(function_name.len() as u16).to_be_bytes()[..],
        &function_name.as_bytes()[..],
        buffer,
    ].concat()
}

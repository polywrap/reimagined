use std::sync::Arc;

use reim_wrap::{ InternalModule, ExternalModule };

pub fn receive(buffer: &[u8], internal_module: &dyn InternalModule, external_module: Arc<dyn ExternalModule>) -> u32 {      
    let result = futures::executor::block_on(
        internal_module.receive(buffer, external_module)
    );

    let output_buffer = [
        &result.len().to_be_bytes(), 
        &result[..]
    ].concat();
    
    let output_buffer_ptr = crate::malloc::alloc(output_buffer.len() as usize) as u32;

    return output_buffer_ptr;
}

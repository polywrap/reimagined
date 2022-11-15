use std::{pin::Pin, future::Future};

pub type OnReceiveFn = Box<
    dyn Fn(Vec<u8>) -> Pin<Box<dyn Future<Output = Vec<u8>> + Send>> + Send
>;

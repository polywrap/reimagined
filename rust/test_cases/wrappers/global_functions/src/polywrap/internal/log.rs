use std::sync::Arc;

use reim_dt::ExternalModule;
use crate::polywrap::wrap::ExternalResource;

pub async fn log(message: &str, external_module: Arc<dyn ExternalModule>) {
    // let buffer = [
    //     &(ExternalResource::Log as u32).to_be_bytes()[..],
    //     &message.as_bytes()
    // ].concat();

    // external_module.send(&buffer).await;
}

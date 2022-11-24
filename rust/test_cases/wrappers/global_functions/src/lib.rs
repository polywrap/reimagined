#![feature(async_closure)]

mod polywrap;

use polywrap::external::test_host_global_function;

pub async fn test_wrapper_global_function(arg: String) -> String {
    test_host_global_function(arg).await
}

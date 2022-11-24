
use crate::bindings::global_functions::polywrap::external::global_functions::test_wrapper_global_function;


pub struct ImportBindings {
    pub testWrapperGlobalFunctionWrapped: test_wrapper_global_function::WrappedClosure,
    
}

impl ImportBindings {
    pub fn new(
        test: test_wrapper_global_function::WrappedClosure,
    ) -> Self {
        Self {
                                                                                                            
            testWrapperGlobalFunctionWrapped: test,     
            
        }
    }

    pub async fn test_wrapper_global_function(&self, arg: String) -> String {
        self.testWrapperGlobalFunctionWrapped.call(arg).await
    }
}

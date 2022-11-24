
use crate::polywrap::external::global_functions::test_host_global_function;


pub struct ImportBindings {
    pub testHostGlobalFunctionWrapped: test_host_global_function::WrappedClosure,
    
}

impl ImportBindings {
    pub fn new(
        test: test_host_global_function::WrappedClosure,
    ) -> Self {
        Self {
                                                                                                            
            testHostGlobalFunctionWrapped: test,     
            
        }
    }

    pub async fn test_host_global_function(&self, arg: String) -> String {
        self.testHostGlobalFunctionWrapped.call(arg).await
    }
}

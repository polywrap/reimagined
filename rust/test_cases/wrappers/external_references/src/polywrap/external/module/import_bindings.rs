
use crate::polywrap::external::{classes::test_external_class::TestExternalClassImport, global_functions::test_external_global_function};


pub struct ImportBindings {
    pub testExternalGlobalFunctionWrapped: test_external_global_function::WrappedClosure,
    pub TestExternalClass: TestExternalClassImport,
    
}

impl ImportBindings {
    pub fn new(
        test: test_external_global_function::WrappedClosure,
        TestExternalClass: TestExternalClassImport,
    ) -> Self {
        Self {
                                                                                                            
            testExternalGlobalFunctionWrapped: test,     
                                    
            TestExternalClass: TestExternalClass,
            
        }
    }

    pub async fn testExternalGlobalFunction(&self, arg: String) -> String {
        self.testExternalGlobalFunctionWrapped.call(arg).await
    }
}

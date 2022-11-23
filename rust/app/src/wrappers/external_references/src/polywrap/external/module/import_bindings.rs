
use crate::polywrap::external::{classes::test_external_class::TestExternalClassImport, global_functions::test_external_global_function::WrappedClosure};


pub struct ImportBindings {
    pub testExternalGlobalFunctionWrapped: WrappedClosure,
    pub TestExternalClass: TestExternalClassImport,
    
}

impl ImportBindings {
    pub fn new(
        test: WrappedClosure,
        TestExternalClass: TestExternalClassImport,
    ) -> Self {
        Self {
                                                                                                            
            testExternalGlobalFunctionWrapped: test,     
                                    
            TestExternalClass: TestExternalClass,
            
        }
    }

    pub fn testExternalGlobalFunction(&self, arg: String) -> String {
        self.testExternalGlobalFunctionWrapped.call(arg)
    }
}

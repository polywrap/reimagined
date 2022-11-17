
use std::{sync::Arc, future::Future};

use crate::polywrap::external::{classes::test_external_class::TestExternalClassImport, global_functions::test_external_global_function::WrappedClosure};



pub struct ImportBindings {
    pub testExternalGlobalFunction: Arc<dyn FnMut(
      String,
    ) -> Box<dyn Future<Output = String>>>,
    pub TestExternalClass: TestExternalClassImport,
    
}

impl ImportBindings {
    pub fn new(
        test: WrappedClosure,
        TestExternalClass: TestExternalClassImport,
    ) -> Self {
        Self {
                                                                                                            
            testExternalGlobalFunction: test.call,     
                                    
            TestExternalClass: TestExternalClass,
            
        }
    }
}

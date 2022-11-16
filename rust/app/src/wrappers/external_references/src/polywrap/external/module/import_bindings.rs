
use std::sync::Arc;

use create::{ TestObjectGetter };

use crate::polywrap::external::classes::test_external_class::{ TestExternalClassImport };
use crate::polywrap::external::{ TestExternalClass };



pub struct ImportBindings {
    pub testExternalGlobalFunction: Arc<dyn FnMut(
      String,
    ) -> String>,
    pub TestExternalClass: TestExternalClassImport,
    
}

impl ImportBindings {
    pub fn new(
        testExternalGlobalFunction: Arc<dyn FnMut(
            String,
        ) -> String>,
        TestExternalClass: TestExternalClassImport,
    ) -> Self {
        Self {
                                                                                                            
            testExternalGlobalFunction: testExternalGlobalFunction,
            
                                    
            TestExternalClass: TestExternalClass,
            
        }
    }
}

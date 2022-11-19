use external::classes::TestObjectGetter::{ TestObjectGetterImport };
use external::{ TestObjectGetter };


use create::{ TestExternalClass };



struct ImportBindings {
    
    pub testReceiveReference: Fn(
      TestExternalClass,
    ) -> string,
        
    pub testInvokeExternalGlobalFunction: Fn(
      string,
    ) -> string,
        
    pub testInvokeExternalStaticMethod: Fn(
      string,
    ) -> string,
        
    pub testInvokeExternalInstanceMethod: Fn(
      string,
    ) -> string,
            
    
    pub TestObjectGetter: TestObjectGetterImport,
            
}

impl ImportBindings {
    pub fn new(
        
        testReceiveReference: (
        arg: TestExternalClass,
        ) -> string,
                
        testInvokeExternalGlobalFunction: (
        arg: string,
        ) -> string,
                
        testInvokeExternalStaticMethod: (
        arg: string,
        ) -> string,
                
        testInvokeExternalInstanceMethod: (
        arg: string,
        ) -> string,
                        
        
        TestObjectGetter: TestObjectGetterImport,
                        
    ) -> Self {
        Self {
            
            testReceiveReference: testReceiveReference,
                        
            testInvokeExternalGlobalFunction: testInvokeExternalGlobalFunction,
                        
            testInvokeExternalStaticMethod: testInvokeExternalStaticMethod,
                        
            testInvokeExternalInstanceMethod: testInvokeExternalInstanceMethod,
                                    
            
            TestObjectGetter: TestObjectGetter,
                                    
        }
    }
}

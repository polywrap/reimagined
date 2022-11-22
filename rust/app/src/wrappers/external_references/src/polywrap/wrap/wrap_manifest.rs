pub mod internal {
    pub enum GlobalFunction {
        TestReceiveReference = 0,
        TestInvokeExternalGlobalFunction = 1,
        TestInvokeExternalStaticMethod = 2,
        TestInvokeExternalInstanceMethod = 3,
    }

    pub enum Class {
        TestObjectGetter = 0,
    }

    pub mod classes {
        pub enum TestObjectGetterMethod {
        Create = 0,
        TestInstanceReceiveReference = 1,
        TestStaticReceiveReference = 2,
        }
    }
    }

pub mod external {
    pub enum GlobalFunction {
        TestExternalGlobalFunction = 4,
    }

    pub enum Class {
        TestExternalClass = 1,
    }

    pub mod classes {
        pub enum TestExternalClassMethod {
        Create = 0,
        TestInstanceMethod = 1,
        TestStaticMethod = 2,
        }
    }
}

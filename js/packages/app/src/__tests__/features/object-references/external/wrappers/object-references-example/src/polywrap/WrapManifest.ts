namespace WrapManifest {
  export namespace Internal {
    export enum GlobalFunction {
      TestReceiveReference = 0,
      TestInvokeExternalGlobalFunction = 1,
      TestInvokeExternalStaticMethod = 2,
      TestInvokeExternalInstanceMethod = 3,
    }

    export enum Class {
      TestObjectGetter = 1,
    }

    export namespace Classes {
      export enum TestObjectGetterMethod {
        Create = 0,
        TestInstanceReceiveReference = 1,
        TestStaticReceiveReference = 2,
      }
    }
  }

  export namespace External {
    export enum GlobalFunction {
      TestExternalGlobalFunction = 0
    }

    export enum Class {
      TestExternalClass = 0,
    }

    export namespace Classes {
      export enum TestExternalClassMethod {
        Create = 0,
        TestInstanceMethod = 1
      }
    }
  }
}
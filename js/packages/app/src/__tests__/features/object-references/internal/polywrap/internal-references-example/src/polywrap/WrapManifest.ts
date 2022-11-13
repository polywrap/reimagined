export namespace WrapManifest {
  export namespace Internal {
    export enum GlobalFunction {
            
    }

    export enum Class {
      
      
      
      
    }

    export namespace Classes {
      
      
      
      
    }
  }

  export namespace External {
    export enum GlobalFunction {
      
      TestReturnReference = 0,
      
    }

    export enum Class {
      
      TestInternalClass = 0,
      
      
      TestObjectGetter = 1,
      
    }

    export namespace Classes {
      
      export enum TestInternalClassMethod {
        Create = 0,
        TestInstanceMethod = 1,
      }
      
      
      export enum TestObjectGetterMethod {
        Create = 0,
        TestInstanceMethod = 1,
        TestStaticMethod = 2,
      }
      
    }
  }
}

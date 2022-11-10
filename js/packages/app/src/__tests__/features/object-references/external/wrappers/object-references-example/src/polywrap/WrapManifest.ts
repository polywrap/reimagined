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
  }

  export namespace External {
    export enum GlobalFunction {
      TestExternalGlobalFunction = 0
    }

    export enum Class {
      TestExternalClass = 0,
    }
  }
}
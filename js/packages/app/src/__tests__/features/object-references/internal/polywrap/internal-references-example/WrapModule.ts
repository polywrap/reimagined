import { IWrapper } from "@polywrap/reim-wrap";
import { createTestReturnReference } from "./global-functions/testReturnReference";
import { create as createTestInternalClass } from "./classes/TestInternalClass";
import { create as createTestObjectGetter } from "./classes/TestObjectGetter";

export let wrapInstance: IWrapInstance | null;

export type IWrapInstance = IWrapper;

export class WrapModule {
  static import(instance: IWrapInstance) {
    return {
      testReturnReference: createTestReturnReference(instance),
      TestInternalClass: createTestInternalClass(instance),
      TestObjectGetter: createTestObjectGetter(instance)
    };
  }

  static connect(instance: IWrapInstance) {
    wrapInstance = instance;
  }
}

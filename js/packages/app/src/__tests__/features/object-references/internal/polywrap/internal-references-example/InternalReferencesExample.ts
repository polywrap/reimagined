import { IWrapper } from "@polywrap/reim-wrap";
import { create as createTestReturnReference } from "./global-functions/testReturnReference/create";
import { create as createTestInternalClass } from "./classes/TestInternalClass";
import { create as createTestObjectGetter } from "./classes/TestObjectGetter";

export class InternalReferencesExample {
  static from(wrapper: IWrapper) {
    return {
      testReturnReference: createTestReturnReference(wrapper),
      TestInternalClass: createTestInternalClass(wrapper),
      TestObjectGetter: createTestObjectGetter(wrapper)
    };
  }
}

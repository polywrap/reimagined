import { createTestReturnReference } from "../external/global-functions/testReturnReference";
import { create as createTestInternalClass } from "../external/classes/TestInternalClass/create";
import { create as createTestObjectGetter } from "../external/classes/TestObjectGetter/create";
import { IWrapInstance } from "./WrapInstance";
import { ImportBindings } from "./ImportBindings";

export class WrapModule {
  static wrapInstance: IWrapInstance | undefined;

  static connect(instance: IWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  static import(instance: IWrapInstance): ImportBindings {
    return new ImportBindings(
      createTestReturnReference(instance),
      createTestInternalClass(instance),
      createTestObjectGetter(instance),
    );
  }
}

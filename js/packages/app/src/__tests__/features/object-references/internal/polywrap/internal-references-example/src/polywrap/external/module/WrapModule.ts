import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { ImportBindings } from "./ImportBindings";

import { create as createTestReturnReference } from "../global-functions/testReturnReference";

import { create as createTestInternalClass } from "../classes/TestInternalClass";
import { create as createTestObjectGetter } from "../classes/TestObjectGetter";


export class WrapModule {
  static wrapInstance: IExternalWrapInstance | null;

  static connect(instance: IExternalWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  static import(instance: IExternalWrapInstance): ImportBindings {
    return new ImportBindings(
      
      createTestReturnReference(instance),
      
      
      createTestInternalClass(instance),
            
      createTestObjectGetter(instance),
      
    );
  }
}

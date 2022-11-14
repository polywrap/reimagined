import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { ImportBindings } from "./ImportBindings";


import { create as createTestClass } from "../classes/TestClass";


export class WrapModule {
  static wrapInstance: IExternalWrapInstance | null;

  static connect(instance: IExternalWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  static import(instance: IExternalWrapInstance): ImportBindings {
    return new ImportBindings(

                                          
      createTestClass(instance),
      
    );
  }
}

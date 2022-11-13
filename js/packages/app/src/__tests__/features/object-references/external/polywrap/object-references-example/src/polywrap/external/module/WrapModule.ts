import { IExternalWrapInstance } from "@nerfzael/reim-wrap-js";
//import { ImportBindings } from "./ImportBindings";

//
//
//import { create as createTestReceiveReference } from "../global-functions/testReceiveReference";
//
//
//
//import { create as createTestInvokeExternalGlobalFunction } from "../global-functions/testInvokeExternalGlobalFunction";
//
//
//
//import { create as createTestInvokeExternalStaticMethod } from "../global-functions/testInvokeExternalStaticMethod";
//
//
//
//import { create as createTestInvokeExternalInstanceMethod } from "../global-functions/testInvokeExternalInstanceMethod";
//
//
//
//
//
//
//import { create as createTestObjectGetter } from "../classes/TestObjectGetter";
//
//
//
//

export class WrapModule {
  static wrapInstance: IExternalWrapInstance | null;

  static connect(instance: IExternalWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  //static import(instance: IExternalWrapInstance): ImportBindings {
  //  return new ImportBindings(
  //    
  //    
  //    createTestReceiveReference(instance),
  //    
  //    
  //    
  //    createTestInvokeExternalGlobalFunction(instance),
  //    
  //    
  //    
  //    createTestInvokeExternalStaticMethod(instance),
  //    
  //    
  //    
  //    createTestInvokeExternalInstanceMethod(instance),
  //    
  //    
  //    
  //    
  //    
  //    
  //    createTestObjectGetter(instance),
  //    
  //    
  //    
  //    
  //  );
  //}
}

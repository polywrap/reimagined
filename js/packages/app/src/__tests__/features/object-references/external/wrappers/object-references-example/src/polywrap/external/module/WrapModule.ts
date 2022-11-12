import { IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
//import { ImportBindings } from "./ImportBindings";

//
//
//
//
//
//
//
//
//
//
//import { create as createTestExternalGlobalFunction } from "../global-functions/testExternalGlobalFunction";
//
//
//
//
//
//
//import { create as createTestExternalClass } from "../classes/TestExternalClass";
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
  //    
  //    
  //    
  //    
  //    
  //    
  //    
  //    
  //    createTestExternalGlobalFunction(instance),
  //    
  //    
  //    
  //    
  //    
  //    
  //    createTestExternalClass(instance),
  //    
  //    
  //  );
  //}
}

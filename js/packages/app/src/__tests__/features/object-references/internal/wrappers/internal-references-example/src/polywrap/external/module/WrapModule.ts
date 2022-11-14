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
  //  );
  //}
}

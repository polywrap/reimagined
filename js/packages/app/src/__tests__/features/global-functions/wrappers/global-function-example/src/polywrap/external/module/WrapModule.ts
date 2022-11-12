import { IWrapInstance } from "@polywrap/reim-wrap-as";
import { ImportBindings } from "./ImportBindings";




export class WrapModule {
  static wrapInstance: IWrapInstance = new ExternalWrapInstance();

  static connect(instance: IWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  static import(instance: IWrapInstance): ImportBindings {
    return new ImportBindings(

                                    
    );
  }
}

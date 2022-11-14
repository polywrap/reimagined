import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { ImportBindings } from "./ImportBindings";

import { create as createStringArgFunction } from "../global-functions/stringArgFunction";
import { create as createObjectArgFunction } from "../global-functions/objectArgFunction";
import { create as createObjectResultFunction } from "../global-functions/objectResultFunction";
import { create as createNestedObjectArgFunction } from "../global-functions/nestedObjectArgFunction";
import { create as createNestedObjectResultFunction } from "../global-functions/nestedObjectResultFunction";



export class WrapModule {
  static wrapInstance: IExternalWrapInstance | null;

  static connect(instance: IExternalWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  static import(instance: IExternalWrapInstance): ImportBindings {
    return new ImportBindings(
      
      createStringArgFunction(instance),
            
      createObjectArgFunction(instance),
            
      createObjectResultFunction(instance),
            
      createNestedObjectArgFunction(instance),
            
      createNestedObjectResultFunction(instance),
      
                                    
    );
  }
}

import { WrapperResource } from "./WrapperResource";
import { invokeGlobalFunction } from "../../wrapped/global-functions";

export function invoke_wrapper_resource(func: WrapperResource, dataBuffer: ArrayBuffer): ArrayBuffer {
  switch(func) {
    case WrapperResource.InvokeGlobalFunction: 
      return invokeGlobalFunction(dataBuffer);
    default: 
      throw new Error("Unknown function");
  }
}

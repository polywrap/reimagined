import { WrapperResource } from "./WrapperResource";
import { invokeGlobalFunction } from "../../wrapped/global-functions";

export function invoke_wrapper_resource(resource: WrapperResource, dataBuffer: ArrayBuffer): ArrayBuffer {
  switch(resource) {
    case WrapperResource.InvokeGlobalFunction: 
      return invokeGlobalFunction(dataBuffer);
    default: 
      throw new Error("Unknown function");
  }
}

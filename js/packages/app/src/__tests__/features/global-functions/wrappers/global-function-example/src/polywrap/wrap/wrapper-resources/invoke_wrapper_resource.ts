import { WrapperResource } from "./WrapperResource";
import { invokeGlobalFunction } from "../../wrapped/global-functions";
import { wrap_log } from "../host-resources/wrap_log";

export function invoke_wrapper_resource(func: WrapperResource, dataBuffer: ArrayBuffer): ArrayBuffer {
  wrap_log("invoke_wrapper_resource: " + func.toString());
  
  switch(func) {
    case WrapperResource.InvokeGlobalFunction: 
      return invokeGlobalFunction(dataBuffer);
    default: 
      throw new Error("Unknown function");
  }
}

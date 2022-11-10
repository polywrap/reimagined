import { WrapperResource } from "./WrapperResource";
import { invokeGlobalFunction } from "../../wrapper/global-functions";
import { wrap_log } from "../host-resources/wrap_log";
import { invokeClassMethod } from "../../wrapper/classes/invokeClassMethod";

export function invoke_wrapper_resource(func: WrapperResource, dataBuffer: ArrayBuffer): ArrayBuffer {
  wrap_log("invoke_wrapper_resource: " + func.toString());
  
  switch(func) {
    case WrapperResource.InvokeGlobalFunction: 
      return invokeGlobalFunction(dataBuffer);
    case WrapperResource.InvokeClassMethod: 
      return invokeClassMethod(dataBuffer);
    default: 
      throw new Error("Unknown function");
  }
}

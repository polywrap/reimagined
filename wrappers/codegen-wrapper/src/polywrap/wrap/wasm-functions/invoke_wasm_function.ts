import { WrapperFunction } from "./WrapperFunction";
import { invokeGlobalFunction } from "../../wrapped/global-functions";

export function invoke_wasm_function(func: WrapperFunction, dataBuffer: ArrayBuffer): ArrayBuffer {
  switch(func) {
    case WrapperFunction.InvokeGlobalFunction: 
      return invokeGlobalFunction(dataBuffer);
    default: 
      throw new Error("Unknown function");
  }
}

import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { 
  testGlobalFunctionWrapped,
} from "./functions";
import { wrap_log } from "../../wrap/host-resources/wrap_log";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  wrap_log("invokeGlobalFunction: " + func.toString());

  switch (func) {
    case GlobalFunction.TestGlobalFunction:
      return testGlobalFunctionWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

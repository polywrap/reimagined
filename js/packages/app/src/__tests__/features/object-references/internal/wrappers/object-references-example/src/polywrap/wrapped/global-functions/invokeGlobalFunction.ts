import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { 
  testReturnReferenceWrapped,
} from "./functions";
import { wrap_log } from "../../wrap/host-resources/wrap_log";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  wrap_log("invokeGlobalFunction: " + func.toString());

  switch (func) {
    case GlobalFunction.TestReturnReference:
      return testReturnReferenceWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

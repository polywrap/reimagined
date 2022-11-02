import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { wrap_log } from "../../wrap/host-resources/wrap_log";
import { 
  testReceiveReferenceWrapped, 
  testInvokeExternalStaticMethodWrapped,
  testInvokeExternalGlobalFunctionWrapped
} from "./functions";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  wrap_log("invokeGlobalFunction: " + func.toString());

  switch (func) {
    case GlobalFunction.TestReceiveReference:
      return testReceiveReferenceWrapped(dataBuffer);
    case GlobalFunction.TestInvokeExternalStaticMethod:
      return testInvokeExternalStaticMethodWrapped(dataBuffer);
    case GlobalFunction.TestInvokeExternalGlobalFunction:
      return testInvokeExternalGlobalFunctionWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

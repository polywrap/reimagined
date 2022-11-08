import { GlobalFunctionList } from "./GlobalFunctionList";
import { bufferToU32 } from "../../buffer";
import { wrap_log } from "../../wrap/host-resources/wrap_log";
import { 
  testReceiveReferenceWrapped, 
  testInvokeExternalGlobalFunctionWrapped,
  testInvokeExternalStaticMethodWrapped,
  testInvokeExternalInstanceMethodWrapped,
} from "./list";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  wrap_log("invokeGlobalFunction: " + func.toString());

  switch (func) {
    case GlobalFunctionList.TestReceiveReference:
      return testReceiveReferenceWrapped(dataBuffer);
    case GlobalFunctionList.TestInvokeExternalGlobalFunction:
      return testInvokeExternalGlobalFunctionWrapped(dataBuffer);
    case GlobalFunctionList.TestInvokeExternalStaticMethod:
      return testInvokeExternalStaticMethodWrapped(dataBuffer);
    case GlobalFunctionList.TestInvokeExternalInstanceMethod:
      return testInvokeExternalInstanceMethodWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { 
  simpleMethodWrapped,
  anotherMethodWrapped,
} from "./functions";
import { wrap_log } from "../../wrap/host-functions/wrap_log";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);
  wrap_log("Received funcy " + func.toString());

  switch (func) {
    case GlobalFunction.SimpleMethod:
      return simpleMethodWrapped(dataBuffer);
    case GlobalFunction.AnotherMethod:
      return anotherMethodWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

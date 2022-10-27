import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { 
  simpleMethodWrapped,
  anotherMethodWrapped,
} from "./functions";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (func) {
    case GlobalFunction.SimpleMethod:
      return simpleMethodWrapped(dataBuffer);
    case GlobalFunction.AnotherMethod:
      return anotherMethodWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

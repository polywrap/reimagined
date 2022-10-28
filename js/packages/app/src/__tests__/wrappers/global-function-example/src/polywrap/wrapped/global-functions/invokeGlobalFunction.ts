import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { 
  simpleFunctionWrapped,
} from "./functions";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (func) {
    case GlobalFunction.SimpleFunction:
      return simpleFunctionWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

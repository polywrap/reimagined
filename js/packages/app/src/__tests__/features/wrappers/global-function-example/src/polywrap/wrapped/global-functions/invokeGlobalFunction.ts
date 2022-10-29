import { GlobalFunction } from "./GlobalFunction";
import { bufferToU32 } from "../../buffer";
import { 
  stringArgFunctionWrapped,
  objectArgFunctionWrapped,
  objectResultFunctionWrapped,
} from "./functions";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (func) {
    case GlobalFunction.StringArgFunction:
      return stringArgFunctionWrapped(dataBuffer);
    case GlobalFunction.ObjectArgFunction:
      return objectArgFunctionWrapped(dataBuffer);
    case GlobalFunction.ObjectResultFunction:
      return objectResultFunctionWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

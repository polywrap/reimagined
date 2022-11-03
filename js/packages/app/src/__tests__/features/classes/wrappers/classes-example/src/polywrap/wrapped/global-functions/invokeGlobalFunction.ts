import { bufferToU32 } from "../../buffer";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (func) {
    default:
      throw new Error("Unknown function");
  }
}

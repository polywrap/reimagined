import { bufferToU32 } from "../../buffer";
import { ClassList } from "./ClassList";
import { invokeTestClassMethod } from "./list/TestClass/invokeTestClassMethod";

export function invokeClassMethod(buffer: ArrayBuffer): ArrayBuffer {
  const classType = bufferToU32(buffer);
  const method = bufferToU32(buffer, 4);
  const dataBuffer = buffer.slice(8);

  switch (classType) {
    case ClassList.TestClass:
      return invokeTestClassMethod(method, dataBuffer);
    default:
      throw new Error("Unknown class ID: " + classType.toString());
  }
}

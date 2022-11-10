import { bufferToU32 } from "../../buffer";
import { invokeTestObjectGetterMethod } from "./list/TestObjectGetter/invokeTestObjectGetterMethod";

export enum ClassList {
  TestObjectGetter = 1,
}

export function invokeClassMethod(buffer: ArrayBuffer): ArrayBuffer {
  const classType = bufferToU32(buffer);
  const method = bufferToU32(buffer, 4);
  const dataBuffer = buffer.slice(8);


  switch (classType) {
    case ClassList.TestObjectGetter:
      return invokeTestObjectGetterMethod(method, dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

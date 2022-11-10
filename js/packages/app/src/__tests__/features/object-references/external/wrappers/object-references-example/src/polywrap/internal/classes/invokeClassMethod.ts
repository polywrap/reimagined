import { bufferToU32 } from "../../buffer";
import { invokeTestObjectGetterMethod } from "./list/TestObjectGetter/invokeTestObjectGetterMethod";

export function invokeClassMethod(buffer: ArrayBuffer): ArrayBuffer {
  const classType = bufferToU32(buffer);

  switch (classType) {
    case WrapManifest.Internal.Class.TestObjectGetter:
      return invokeTestObjectGetterMethod(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

import { bufferToU32 } from "../../buffer";
import { wrap_log } from "../../wrap/host-resources/wrap_log";
import { ClassList } from "./ClassList";
import { TestInternalClassWrapped } from "./list/TestInternalClass/TestInternalClassWrapped";
import { TestObjectGetterWrapped } from "./list/TestObjectGetter/TestObjectGetterWrapped";

export function invokeClassMethod(buffer: ArrayBuffer): ArrayBuffer {
  const classId = bufferToU32(buffer);
  const method = bufferToU32(buffer, 4);
  const dataBuffer = buffer.slice(8);

  wrap_log("invokeClassMethod: " + classId.toString() + " " + method.toString());

  switch (classId) {
    case ClassList.TestInternalClass:
      return TestInternalClassWrapped.invokeMethod(method, dataBuffer);
    case ClassList.TestObjectGetter:
      return TestObjectGetterWrapped.invokeMethod(method, dataBuffer);
    default:
      throw new Error("Unknown class: " + classId.toString());
  }
}

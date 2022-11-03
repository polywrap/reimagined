import { TestClass } from "../../../../../../..";
import { bufferToU32 } from "../../../../../../buffer";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testInstanceMethodWrapped(buffer: ArrayBuffer): ArrayBuffer {
  wrap_log("testInstanceMethodWrapped");
  const args = deserializeType(buffer);
  wrap_log("testInstanceMethodWrapped " + args.objectReferencePtr.toString() + " " + args.args.arg);

  const object = changetype<TestClass>(args.objectReferencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return serializeResult(result);
}

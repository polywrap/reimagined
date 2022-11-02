import { TestInternalClass } from "../../../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testInstanceMethodWrapped(buffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(buffer);

  const object = changetype<TestInternalClass>(args.objectReferencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return serializeResult(result);
}

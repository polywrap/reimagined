import { TestObjectGetter } from "../../../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testInstanceReceiveReferenceWrapped(buffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(buffer);

  const object = changetype<TestObjectGetter>(args.objectReferencePtr);

  const result = object.testInstanceReceiveReference(args.args.arg);

  return serializeResult(result);
}

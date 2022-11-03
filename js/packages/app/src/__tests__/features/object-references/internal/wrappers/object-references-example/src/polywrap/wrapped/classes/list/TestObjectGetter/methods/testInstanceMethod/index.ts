import { TestObjectGetter } from "../../../../../../..";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testInstanceMethodWrapped(buffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(buffer);

  // const object = referenceMap.get(args.objectReferencePtr) as TestObjectGetter;

  wrap_log("AAAAAAAAAAAAAA: " + args.objectReferencePtr.toString());
  const object = changetype<TestObjectGetter>(args.objectReferencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return serializeResult(result);
}

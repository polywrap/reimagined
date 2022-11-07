import { TestObjectGetter } from "../../../../../../..";
import { TestInternalClassWrapped } from "../../../TestInternalClass/TestInternalClassWrapped";
import { deserializeType } from "./args-serialization";

export function testInstanceMethodWrapped(buffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(buffer);

  const object = changetype<TestObjectGetter>(args.objectReferencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return TestInternalClassWrapped.serialize(result);
}

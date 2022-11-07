import { TestInternalClass } from "../../../../../../..";
import { deserializeType } from "./args-serialization";
import { BaseTypeSerialization } from "../../../../../../serialization/BaseTypeSerialization";

export function testInstanceMethodWrapped(buffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(buffer);

  const object = changetype<TestInternalClass>(args.objectReferencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return BaseTypeSerialization.serialize<String>(result);
}

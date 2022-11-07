import { TestObjectGetter } from "../../../../../../..";
import { TestInternalClassWrapped } from "../../../TestInternalClass/TestInternalClassWrapped";
import { deserializeType } from "./args-serialization";

export function testStaticMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = TestObjectGetter.testStaticMethod(args.arg);

  return TestInternalClassWrapped.serialize(result);
}

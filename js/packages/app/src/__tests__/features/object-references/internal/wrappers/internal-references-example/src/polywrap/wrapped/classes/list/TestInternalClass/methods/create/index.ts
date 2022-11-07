import { TestInternalClass } from "../../../../../../..";
import { deserializeType } from "./args-serialization";
import { TestInternalClassWrapped } from "../../TestInternalClassWrapped";

export function createWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = TestInternalClass.create(args.arg);

  return TestInternalClassWrapped.serialize(result);
}

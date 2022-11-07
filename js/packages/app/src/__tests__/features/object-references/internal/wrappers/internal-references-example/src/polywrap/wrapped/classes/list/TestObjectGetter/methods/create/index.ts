import { TestObjectGetter } from "../../../../../../..";
import { TestObjectGetterWrapped } from "../../TestObjectGetterWrapped";
import { deserializeType } from "./args-serialization";

export function createWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = TestObjectGetter.create(args.arg);

  return TestObjectGetterWrapped.serialize(result);
}



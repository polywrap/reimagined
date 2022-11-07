import { testReturnReference } from "../../../../..";
import { TestInternalClassWrapped } from "../../../classes/list/TestInternalClass/TestInternalClassWrapped";
import { deserializeType } from "./args-serialization";

export function testReturnReferenceWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = testReturnReference(
    args.arg
  );

  return TestInternalClassWrapped.serialize(result);
}

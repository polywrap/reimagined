import { testReturnReference } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testReturnReferenceWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = testReturnReference(
    args.arg
  );

  return serializeResult(result);
}

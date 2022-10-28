import { simpleFunction } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function simpleFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = simpleFunction(
    args.arg
  );

  return serializeResult(result);
}

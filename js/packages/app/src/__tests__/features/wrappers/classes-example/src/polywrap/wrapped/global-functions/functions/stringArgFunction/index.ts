import { stringArgFunction } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function stringArgFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = stringArgFunction(
    args.arg
  );

  return serializeResult(result);
}

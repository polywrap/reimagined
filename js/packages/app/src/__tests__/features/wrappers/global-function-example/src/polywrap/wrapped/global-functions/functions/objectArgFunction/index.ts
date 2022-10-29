import { objectArgFunction } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function objectArgFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = objectArgFunction(
    args.arg
  );

  return serializeResult(result);
}

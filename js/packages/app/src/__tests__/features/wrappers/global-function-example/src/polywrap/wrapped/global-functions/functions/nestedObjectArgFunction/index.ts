import { nestedObjectArgFunction } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function nestedObjectArgFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = nestedObjectArgFunction(
    args.arg
  );

  return serializeResult(result);
}

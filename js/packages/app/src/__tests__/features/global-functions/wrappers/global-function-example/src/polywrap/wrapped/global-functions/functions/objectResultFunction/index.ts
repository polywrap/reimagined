import { objectResultFunction } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function objectResultFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = objectResultFunction(
    args.arg
  );

  return serializeResult(result);
}

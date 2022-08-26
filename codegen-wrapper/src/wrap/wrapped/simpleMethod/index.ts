import { simpleMethod } from "../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function simpleMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = simpleMethod(
    args.arg
  );

  return serializeResult(result);
}

import { anotherMethod } from "../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function anotherMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = anotherMethod(
    args.arg
  );

  return serializeResult(result);
}

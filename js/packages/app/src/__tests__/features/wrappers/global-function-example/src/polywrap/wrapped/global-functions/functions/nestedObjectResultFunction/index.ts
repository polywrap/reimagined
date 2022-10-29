import { nestedObjectResultFunction } from "../../../../..";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function nestedObjectResultFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  const result = nestedObjectResultFunction(
    args.arg
  );

  return serializeResult(result);
}

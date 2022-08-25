import { deserializeArgs } from "./deserializeArgs";
import { serializeResult } from "./serializeResult";

export function externalFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const args = deserializeArgs(dataBuffer);

    const result = externalFunction(
        args.arg
    );

    return serializeResult(result);
}

import { internalFunction } from "../../..";
import { deserializeArgs } from "./deserializeArgs";
import { serializeResult } from "./serializeResult";

export function internalFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const args = deserializeArgs(dataBuffer);

    const result = internalFunction(
        args.arg
    );

    return serializeResult(result);
}

import { EthereumProvider } from "../../../../..";
import { deserializeArgs } from "./deserializeArgs";
import { serializeResult } from "./serializeResult";

export function instanceMethodWrapped(instance: EthereumProvider, dataBuffer: ArrayBuffer): ArrayBuffer {
    const args = deserializeArgs(dataBuffer);

    const result = instance.instanceMethod(
        args.arg
    );

    return serializeResult(result);
}

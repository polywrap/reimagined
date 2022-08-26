import { EthereumProvider } from "../../../../..";
import { deserializeArgs } from "./deserializeArgs";
import { serializeResult } from "./serializeResult";

export function incrementWrapped(instance: EthereumProvider, dataBuffer: ArrayBuffer): ArrayBuffer {
    const args = deserializeArgs(dataBuffer);

    const result = instance.increment(
        args.calc
    );

    return serializeResult(result);
}

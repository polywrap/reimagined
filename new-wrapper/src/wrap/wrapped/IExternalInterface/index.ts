import { EthereumProvider } from "../../..";
import { Context } from "../../Context";
import { DataView } from "../../DataView";
import { serializeReferencePtr } from "../serialization/serializeU64";
import { deserializeCtorArgs } from "./deserializeCtorArgs";
import { getSignerWrapped } from "./instance/getSigner";
import { instanceMethodWrapped } from "./instance/instanceMethod";

export function externalType_Ctor_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const argsBuffer = dataBuffer;

    const args = deserializeCtorArgs(argsBuffer);

    const instance = new EthereumProvider(
        args.arg
    );

    const result = changetype<u64>(instance);

    return serializeReferencePtr(result);
}

export function externalType_instanceMethod_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 4, new Context());
    const instancePtr = instancePtrView.getUint32();
    
    const argsBuffer = dataBuffer.slice(4);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return instanceMethodWrapped(instance, argsBuffer);
}

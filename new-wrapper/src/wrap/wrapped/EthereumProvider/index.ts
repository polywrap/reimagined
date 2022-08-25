import { EthereumProvider } from "../../..";
import { Context } from "../../Context";
import { DataView } from "../../DataView";
import { serializeReferencePtr } from "../../serialization/serializeReferencePtr";
import { deserializeCtorArgs } from "./deserializeCtorArgs";
import { getSignerWrapped } from "./instance/getSigner";
import { instanceMethodWrapped } from "./instance/instanceMethod";

export function ethereumProvider_Ctor_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const argsBuffer = dataBuffer;

    const args = deserializeCtorArgs(argsBuffer);

    const instance = new EthereumProvider(
        args.arg
    );

    const result = changetype<u64>(instance);

    return serializeReferencePtr(result);
}

export function ethereumProvider_instanceMethod_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 8, new Context());
    const instancePtr = instancePtrView.getUint64();
    
    const argsBuffer = dataBuffer.slice(8);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return instanceMethodWrapped(instance, argsBuffer);
}

export function ethereumProvider_getSigner_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 8, new Context());
    const instancePtr = instancePtrView.getUint64();
    
    const argsBuffer = dataBuffer.slice(8);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return getSignerWrapped(instance, argsBuffer);
}

export function ethereumProvider_increment_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 8, new Context());
    const instancePtr = instancePtrView.getUint64();
    
    const argsBuffer = dataBuffer.slice(8);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return incrementWrapped(instance, argsBuffer);
}

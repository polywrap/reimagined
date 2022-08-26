import { EthereumProvider } from "../../..";
import { Context } from "../../Context";
import { DataView } from "../../DataView";
import { serializeu32 } from "../serialization/serializeu32";
import { deserializeCtorArgs } from "./deserializeCtorArgs";
import { getSignerWrapped } from "./instance/getSigner";
import { incrementWrapped } from "./instance/increment";
import { instanceMethodWrapped } from "./instance/instanceMethod";

export function ethereumProvider_Ctor_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const argsBuffer = dataBuffer;

    const args = deserializeCtorArgs(argsBuffer);

    const instance = new EthereumProvider(
        args.arg
    );

    const result = changetype<u32>(instance);

    return serializeu32(result);
}

export function ethereumProvider_instanceMethod_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 4, new Context());
    const instancePtr = instancePtrView.getUint32();
    
    const argsBuffer = dataBuffer.slice(4);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return instanceMethodWrapped(instance, argsBuffer);
}

export function ethereumProvider_getSigner_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 4, new Context());
    const instancePtr = instancePtrView.getUint32();
    
    const argsBuffer = dataBuffer.slice(4);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return getSignerWrapped(instance, argsBuffer);
}

export function ethereumProvider_increment_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 4, new Context());
    const instancePtr = instancePtrView.getUint32();
    
    const argsBuffer = dataBuffer.slice(4);

    const instance: EthereumProvider = changetype<EthereumProvider>(instancePtr);

    return incrementWrapped(instance, argsBuffer);
}

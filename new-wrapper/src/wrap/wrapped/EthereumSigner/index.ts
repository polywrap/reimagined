import { EthereumSigner } from "../../..";
import { Context } from "../../Context";
import { DataView } from "../../DataView";
import { serializeReferencePtr } from "../../serialization/serializeReferencePtr";
import { deserializeCtorArgs } from "./deserializeCtorArgs";
import { getAddressWrapped } from "./instance/getAddress";
import { EthereumSignerWrapped } from "./type";

export {
  EthereumSignerWrapped,
  ethereumSigner_Ctor_Wrapped,
  ethereumSigner_getAddress_Wrapped,
};

function ethereumSigner_Ctor_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const argsBuffer = dataBuffer;

    const args = deserializeCtorArgs(argsBuffer);

    const instance = new EthereumSigner(
        args.arg
    );

    const result = changetype<u64>(instance);

    return serializeReferencePtr(result);
}

function ethereumSigner_getAddress_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 8, new Context());
    const instancePtr = instancePtrView.getUint64();
    
    const argsBuffer = dataBuffer.slice(8);

    const instance: EthereumSigner = changetype<EthereumSigner>(instancePtr);

    return getAddressWrapped(instance, argsBuffer);
}

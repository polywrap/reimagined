import { EthereumSigner } from "../../..";
import { Context } from "../../Context";
import { DataView } from "../../DataView";
import { serializeu32 } from "../serialization/serializeu32";
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

    const result = changetype<u32>(instance);

    return serializeu32(result);
}

function ethereumSigner_getAddress_Wrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
    const instancePtrView = new DataView(dataBuffer, 0, 4, new Context());
    const instancePtr = instancePtrView.getUint32();
    
    const argsBuffer = dataBuffer.slice(4);

    const instance: EthereumSigner = changetype<EthereumSigner>(instancePtr);

    return getAddressWrapped(instance, argsBuffer);
}

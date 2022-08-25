import { DataView } from "./DataView";
import { Context } from "./Context";
import { __wrap_invoke_error } from "@polywrap/wasm-as";
import { 
    ethereumProvider_Ctor_Wrapped, ethereumProvider_instanceMethod_Wrapped,
    ethereumProvider_getSigner_Wrapped, ethereumProvider_increment_Wrapped,
} from "./wrapped/EthereumProvider";
import { ethereumSigner_Ctor_Wrapped, ethereumSigner_getAddress_Wrapped } from "./wrapped/EthereumSigner";
import { internalFunctionWrapped } from "./wrapped/internalFunction";
import { externalFunctionWrapped } from "./wrapped/externalFunction";
import { __wrap_invoke_host, __wrap_return_invoke_wasm_result } from "./imports";

export function wrap_invoke_wasm(inputBuffer: ArrayBuffer): bool {
    const resourceView = new DataView(inputBuffer, 0, 8, new Context());
    const resourceId = resourceView.getUint64();

    const dataBuffer = inputBuffer.slice(8);

    return wrap_invoke_wasm_resource(resourceId, dataBuffer);
}

export function wrap_invoke_host(inputBuffer: ArrayBuffer): bool {
  const resourceView = new DataView(inputBuffer, 0, 8, new Context());
  const resourceId = resourceView.getUint64();

  const dataBuffer = inputBuffer.slice(8);

  const outputBuffer = wrap_invoke_host_resource(resourceId, dataBuffer);

  const outputBufferPtr = changetype<u64>(outputBuffer);

  return __wrap_invoke_host(outputBufferPtr, outputBuffer.length);
}

function return_result(resultBuffer: ArrayBuffer): bool {
    __wrap_return_invoke_wasm_result(
      changetype<u32>(resultBuffer),
      resultBuffer.byteLength
    );

    return true;
}

function wrap_invoke_wasm_resource(resourceId: u64, dataBuffer: ArrayBuffer): bool {
    switch(resourceId) {
        case 0: 
            return return_result(internalFunctionWrapped(dataBuffer));
        case 1: 
            return return_result(ethereumProvider_Ctor_Wrapped(dataBuffer));
        case 2: 
            return return_result(ethereumProvider_instanceMethod_Wrapped(dataBuffer));
        case 3: 
            return return_result(ethereumProvider_getSigner_Wrapped(dataBuffer));
        case 4: 
            return return_result(ethereumProvider_increment_Wrapped(dataBuffer));
        case 5: 
            return return_result(ethereumSigner_Ctor_Wrapped(dataBuffer));
        case 6: 
            return return_result(ethereumSigner_getAddress_Wrapped(dataBuffer));
        default: 
            return false;
    }
}

function wrap_invoke_host_resource(resourceId: u64, dataBuffer: ArrayBuffer): bool {
  switch(resourceId) {
      case 0: 
          return return_result(externalFunctionWrapped(dataBuffer));
      case 1: 
          return return_result(ExternalType_Ctor_Wrapped(dataBuffer));
      case 2: 
          return return_result(ExternalType_instanceMethod_Wrapped(dataBuffer));
      default: 
          return false;
  }
}


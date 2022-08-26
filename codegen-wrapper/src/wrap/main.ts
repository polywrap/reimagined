import { DataView } from "./DataView";
import { Context } from "./Context";
import { wrap_abort, __wrap_invoke_error } from "@polywrap/wasm-as";
import { __wrap_fill_invoke_host_result, __wrap_invoke_host, __wrap_return_invoke_wasm_result } from "./imports";
import { serializeu32 } from "./serialization/serializeu32";
import { simpleMethodWrapped } from "./wrapped/simpleMethod";

export function wrap_invoke_wasm(inputBuffer: ArrayBuffer): bool {
    const resourceView = new DataView(inputBuffer, 0, 4, new Context());
    const resourceId = resourceView.getUint32();

    const dataBuffer = inputBuffer.slice(4);

    return wrap_invoke_wasm_resource(resourceId, dataBuffer);
}

function return_result(resultBuffer: ArrayBuffer): bool {
    __wrap_return_invoke_wasm_result(
      changetype<u32>(resultBuffer),
      resultBuffer.byteLength
    );

    return true;
}

function wrap_invoke_wasm_resource(resourceId: u32, dataBuffer: ArrayBuffer): bool {
    switch(resourceId) {
        case 0: 
            return return_result(simpleMethodWrapped(dataBuffer));
        default: 
            return false;
    }
}

export function wrap_invoke_host_resource(resourceId: u32, dataBuffer: ArrayBuffer): ArrayBuffer {
  const resourceIdBuffer = serializeu32(resourceId);

  var tmp = new Uint8Array(resourceIdBuffer.byteLength + dataBuffer.byteLength);
  tmp.set(new Uint8Array(resourceIdBuffer), 0);
  tmp.set(new Uint8Array(dataBuffer), resourceIdBuffer.byteLength);

  const resultLenBuffer = new ArrayBuffer(4);
  const success =__wrap_invoke_host(changetype<u32>(tmp.buffer), tmp.byteLength, changetype<u32>(resultLenBuffer));

  if (success) {
    const resultLenView = new DataView(resultLenBuffer, 0, 4, new Context());
    const resultLen = resultLenView.getUint32();

    const resultBuffer = new ArrayBuffer(resultLen);
  
    __wrap_fill_invoke_host_result(changetype<u32>(resultBuffer));

    return resultBuffer;
  }
}

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  wrap_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
import { concat, bufferToU32, u32ToBuffer } from "../buffer";
import { __dt_fill_send_result, __dt_send } from "./imports";
import { invoke_wasm_function } from "../wrap/wasm-functions/invoke_wasm_function";

export function receive(buffer: ArrayBuffer): u32 {
  const functionId = bufferToU32(buffer);

  const dataBuffer = buffer.slice(4);

  const result = invoke_wasm_function(functionId, dataBuffer);

  const tmp = concat(u32ToBuffer(result.byteLength), result);
  return changetype<u32>(tmp);
}

export function send(buffer: ArrayBuffer): ArrayBuffer {
  const resultLen = __dt_send(changetype<u32>(buffer), buffer.byteLength);

  if (resultLen === 0) {
    return new ArrayBuffer(0);
  }

  const resultBuffer = new ArrayBuffer(resultLen);

  __dt_fill_send_result(changetype<u32>(resultBuffer));

  return resultBuffer;
}

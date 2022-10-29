import { concat, bufferToU32, u32ToBuffer } from "../buffer";
import { __dt_fill_send_result, __dt_send } from "./imports";
import { invoke_wasm_function } from "../wrap/wasm-functions/invoke_wasm_function";
import { wrap_log } from "../wrap/host-functions/wrap_log";
import { HostFunction } from "../wrap/host-functions/HostFunction";
import { invoke_host_function } from "../wrap/host-functions/invoke_host_function";

export function receive(buffer: ArrayBuffer): u32 {
  const functionId = bufferToU32(buffer);
  wrap_log("Received function id " + functionId.toString());

  const dataBuffer = buffer.slice(4);

  const result = invoke_wasm_function(functionId, dataBuffer);

  const tmp = concat(u32ToBuffer(result.byteLength), result);
  wrap_log("This is u32ToBuffer(result.byteLength)");
  invoke_host_function(HostFunction.Log, u32ToBuffer(result.byteLength));
  wrap_log("This is result.byteLength " + result.byteLength.toString());
  wrap_log("This is the result ptr " + changetype<u32>(tmp).toString());
  invoke_host_function(HostFunction.Log, tmp);
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

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
}

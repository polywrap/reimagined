import { concat, bufferToU32, u32ToBuffer } from "../buffer";
import { __dt_fill_send_result, __dt_send } from "./imports";
import { invoke_wrapper_resource } from "../wrap/wrapper-resources/invoke_wrapper_resource";
import { wrap_log } from "../wrap/host-resources/wrap_log";
import { HostResource } from "../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../wrap/host-resources/invoke_host_resource";

export function receive(buffer: ArrayBuffer): u32 {
  const resourceId = bufferToU32(buffer);

  const dataBuffer = buffer.slice(4);

  const result = invoke_wrapper_resource(resourceId, dataBuffer);

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

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
}

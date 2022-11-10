import { concat, bufferToU32, u32ToBuffer } from "../buffer";
import { __dt_fill_send_result, __dt_send } from "./imports";
import { wrapInstance } from "../wrap/WrapInstance";

export function receive(buffer: ArrayBuffer): u32 {
  const result = wrapInstance.onReceive(buffer);

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

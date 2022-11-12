import { bufferToU32, concat, u32ToBuffer } from "@nerfzael/reim-wrap-as";
import { __dt_fill_send_result, __dt_send } from "./imports";
import { WrapModule } from "../external/module/WrapModule";
import { ExternalWrapInstance } from "../external/module/ExternalWrapInstance";
import { InternalWrapInstance } from "../external/module/InternalWrapInstance";

export function receive(buffer: ArrayBuffer): u32 {
  WrapModule.wrapInstance = new ExternalWrapInstance();

  const resource = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);
  
  const result = new InternalWrapInstance().invokeResource(resource, dataBuffer, WrapModule.wrapInstance as ExternalWrapInstance);

  const tmp = concat([
    u32ToBuffer(result.byteLength), 
    result
  ]);

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

import { concat, u32ToBuffer } from "../../buffer";
import { send } from "../../dt";
import { HostFunction } from "./HostFunction";

export function invoke_host_function(func: HostFunction, dataBuffer: ArrayBuffer): ArrayBuffer {
  return send(
    concat(
      u32ToBuffer(func), 
      dataBuffer
    )
  );
}

import { concat, u32ToBuffer } from "../../buffer";
import { send } from "../../dt";
import { HostResource } from "./HostResource";

export function invoke_host_resource(resource: HostResource, dataBuffer: ArrayBuffer): ArrayBuffer {
  return send(
    concat(
      u32ToBuffer(resource), 
      dataBuffer
    )
  );
}

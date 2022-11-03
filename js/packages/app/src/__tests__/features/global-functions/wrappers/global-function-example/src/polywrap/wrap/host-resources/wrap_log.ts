import { HostResource } from "./HostResource";
import { invoke_host_resource } from "./invoke_host_resource";

export function wrap_log(msg: string): void {
  const msgBuf = String.UTF8.encode(msg);
  invoke_host_resource(HostResource.Log, msgBuf);
}

import { HostFunction } from "./HostFunction";
import { invoke_host_function } from "./invoke_host_function";

export function wrap_log(msg: string): void {
  const msgBuf = String.UTF8.encode(msg);
  invoke_host_function(HostFunction.Log, msgBuf);
}

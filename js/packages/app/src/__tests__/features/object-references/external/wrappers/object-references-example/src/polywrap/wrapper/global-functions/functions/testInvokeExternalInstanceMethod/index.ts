import { testInvokeExternalInstanceMethod } from "../../../../../..";
import { HostResource } from "../../../../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../../../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from "../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testInvokeExternalInstanceMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  invoke_host_resource(HostResource.Log, dataBuffer);

  const args = deserializeType(dataBuffer);

  const result = testInvokeExternalInstanceMethod(
    args.arg
  );

  wrap_log("testInvokeExternalInstanceMethodWrapped: " + result.toString());
  return serializeResult(result);
}

import { TestObjectGetter } from "../../../../../../..";
import { HostResource } from "../../../../../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../../../../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testStaticReceiveReferenceWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  invoke_host_resource(HostResource.Log, dataBuffer);
  wrap_log("testStaticMethodWrapped deserializeType");
  const args = deserializeType(dataBuffer);

  const result = TestObjectGetter.testStaticReceiveReference(args.arg);

  wrap_log("testStaticMethodWrapped result");
  return serializeResult(result);
}

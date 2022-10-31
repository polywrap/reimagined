import { TestClass } from "../../../../../../..";
import { HostResource } from "../../../../../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../../../../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function testStaticMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  invoke_host_resource(HostResource.Log, dataBuffer);
  wrap_log("testStaticMethodWrapped deserializeType");
  const args = deserializeType(dataBuffer);
  wrap_log("testStaticMethodWrapped args: " + args.arg);

  const result = TestClass.testStaticMethod(args.arg);

  wrap_log("testStaticMethodWrapped result: " + result);
  return serializeResult(result);
}

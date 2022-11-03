import { bufferToU32 } from "../../buffer";
import { HostResource } from "../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from "../../wrap/host-resources/wrap_log";
import { ClassList } from "./ClassList";
import { invokeTestClassMethod } from "./list/TestClass/invokeTestClassMethod";

export function invokeClassMethod(buffer: ArrayBuffer): ArrayBuffer {
  wrap_log("invokeClassMethod");
  const classType = bufferToU32(buffer);
  wrap_log("invokeClassMethod: " + classType.toString());
  invoke_host_resource(HostResource.Log, buffer);
  const method = bufferToU32(buffer, 4);
  wrap_log("invokeClassMethod2: " + method.toString());
  const dataBuffer = buffer.slice(8);

  wrap_log("invokeClassMethod: " + classType.toString() + " " + method.toString());

  switch (classType) {
    case ClassList.TestClass:
      return invokeTestClassMethod(method, dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

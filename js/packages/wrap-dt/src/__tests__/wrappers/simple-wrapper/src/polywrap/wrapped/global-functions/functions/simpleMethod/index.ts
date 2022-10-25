import { simpleMethod } from "../../../../..";
import { HostFunction } from "../../../../wrap/host-functions/HostFunction";
import { invoke_host_function } from "../../../../wrap/host-functions/invoke_host_function";
import { wrap_log } from "../../../../wrap/host-functions/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function simpleMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {  
  const args = deserializeType(dataBuffer);
  wrap_log("Received args " + args.arg);

  const result = simpleMethod(
    args.arg
  );
  wrap_log("Received result " + result);

  const resultB = serializeResult(result);
  invoke_host_function(HostFunction.Log, resultB);

  return resultB;
}

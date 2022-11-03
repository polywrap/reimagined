import { TestInternalClass } from "../../../../../../..";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function createWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  wrap_log("create args: " + args.arg);
  const result = new TestInternalClass(args.arg);

  wrap_log("create result: " + changetype<u32>(result).toString());

  return serializeResult(changetype<u32>(result));
}

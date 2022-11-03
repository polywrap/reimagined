import { TestObjectGetter } from "../../../../../../..";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function createWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  wrap_log("create args: " + args.arg);
  const result = new TestObjectGetter(args.arg);

  const ptr = changetype<u32>(result);
  wrap_log("create result: " + ptr.toString());

  // referenceMap.set(ptr, result);
  return serializeResult(ptr);
}

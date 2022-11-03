import { TestObjectGetter } from "../../../../../../..";
import { wrap_log } from "../../../../../../wrap/host-resources/wrap_log";
import { deserializeType } from "./args-serialization";
import { serializeResult } from "./serializeResult";

export function constructorWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = deserializeType(dataBuffer);

  wrap_log("constructorWrapped args: " + args.arg);
  const result = new TestObjectGetter(args.arg);

  wrap_log("constructorWrapped result: " + changetype<u32>(result).toString());

  return serializeResult(changetype<u32>(result));
}

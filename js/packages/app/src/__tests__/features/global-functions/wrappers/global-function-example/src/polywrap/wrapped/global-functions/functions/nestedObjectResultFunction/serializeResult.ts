import { stringify } from "@serial-as/json";
import { ObjectWithChildren } from "../../../types/ObjectWithChildren";

export function serializeResult(result: ObjectWithChildren): ArrayBuffer {
  return String.UTF8.encode(stringify<ObjectWithChildren>(result));
}

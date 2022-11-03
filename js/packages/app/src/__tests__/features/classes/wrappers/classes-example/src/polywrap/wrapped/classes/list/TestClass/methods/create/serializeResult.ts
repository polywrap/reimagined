import { stringify } from "@serial-as/json";

export function serializeResult(result: u32): ArrayBuffer {
  return String.UTF8.encode(stringify<u32>(result));
}

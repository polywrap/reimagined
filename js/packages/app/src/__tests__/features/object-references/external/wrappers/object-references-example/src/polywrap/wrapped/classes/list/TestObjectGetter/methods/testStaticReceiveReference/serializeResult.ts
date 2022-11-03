import { stringify } from "@serial-as/json";

export function serializeResult(result: string): ArrayBuffer {
  return String.UTF8.encode(stringify<string>(result));
}

import { stringify } from "@serial-as/json";
import { TestObject } from "../../../types/TestObject";

export function serializeResult(result: TestObject): ArrayBuffer {
  return String.UTF8.encode(stringify<TestObject>(result));
}

import { stringify } from "@serial-as/json";
import { TestInternalClass } from "../../../../..";
import { TestInternalClassWrapped } from "../../../types/TestInternalClassWrapped";

export function serializeResult(result: TestInternalClass): ArrayBuffer {
  const wrappedResult = new TestInternalClassWrapped(
    changetype<u32>(result)
  );

  return String.UTF8.encode(stringify<TestInternalClassWrapped>(wrappedResult));
}

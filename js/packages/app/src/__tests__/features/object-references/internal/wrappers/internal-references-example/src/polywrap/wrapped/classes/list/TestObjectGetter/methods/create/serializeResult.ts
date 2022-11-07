import { stringify } from "@serial-as/json";
import { TestObjectGetter } from "../../../../../../..";

export function serializeResult(result: TestObjectGetter): ArrayBuffer {
  const sanitizedResult = {
    __objectReferencePtr: changetype<u32>(result)
  };

  return String.UTF8.encode(stringify<Result>(sanitizedResult));
}

type Result = {
  __objectReferencePtr: u32,
};

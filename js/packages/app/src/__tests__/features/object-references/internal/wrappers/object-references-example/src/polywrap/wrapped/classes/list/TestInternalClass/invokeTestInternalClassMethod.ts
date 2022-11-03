import { createWrapped } from "./methods/create";
import { testInstanceMethodWrapped } from "./methods/testInstanceMethod";
import { TestInternalClassMethod } from "./TestInternalClassMethod";

export function invokeTestInternalClassMethod(method: TestInternalClassMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestInternalClassMethod.Create:
      return createWrapped(buffer);
    case TestInternalClassMethod.TestInstanceMethod:
      return testInstanceMethodWrapped(buffer);
    default:
      throw new Error("Unknown function");
  }
}

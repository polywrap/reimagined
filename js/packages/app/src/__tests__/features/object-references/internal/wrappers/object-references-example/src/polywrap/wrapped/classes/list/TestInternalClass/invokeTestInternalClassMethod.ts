import { constructorWrapped } from "./methods/constructor";
import { testInstanceMethodWrapped } from "./methods/testInstanceMethod";
import { TestInternalClassMethod } from "./TestInternalClassMethod";

export function invokeTestInternalClassMethod(method: TestInternalClassMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestInternalClassMethod.Constructor:
      return constructorWrapped(buffer);
    case TestInternalClassMethod.TestInstanceMethod:
      return testInstanceMethodWrapped(buffer);
    default:
      throw new Error("Unknown function");
  }
}

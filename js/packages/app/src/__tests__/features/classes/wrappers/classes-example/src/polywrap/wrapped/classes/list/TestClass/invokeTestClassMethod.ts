import { createWrapped } from "./methods/create";
import { testInstanceMethodWrapped } from "./methods/testInstanceMethod";
import { testStaticMethodWrapped } from "./methods/testStaticMethod";
import { TestClassMethod } from "./TestClassMethod";

export function invokeTestClassMethod(method: TestClassMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestClassMethod.Create:
      return createWrapped(buffer);
    case TestClassMethod.TestInstanceMethod:
      return testInstanceMethodWrapped(buffer);
    case TestClassMethod.TestStaticMethod:
      return testStaticMethodWrapped(buffer);
    default:
      throw new Error("Unknown method");
  }
}

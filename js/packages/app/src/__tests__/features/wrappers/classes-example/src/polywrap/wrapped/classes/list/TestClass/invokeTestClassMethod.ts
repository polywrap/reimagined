import { constructorWrapped } from "./methods/constructor";
import { testInstanceMethodWrapped } from "./methods/testInstanceMethod";
import { testStaticMethodWrapped } from "./methods/testStaticMethod";
import { TestClassMethod } from "./TestClassMethod";

export function invokeTestClassMethod(method: TestClassMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestClassMethod.Constructor:
      return constructorWrapped(buffer);
    case TestClassMethod.TestInstanceMethod:
      return testInstanceMethodWrapped(buffer);
    case TestClassMethod.TestStaticMethod:
      return testStaticMethodWrapped(buffer);
    default:
      throw new Error("Unknown function");
  }
}

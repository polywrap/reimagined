import { createWrapped } from "./methods/create";
import { testInstanceMethodWrapped } from "./methods/testInstanceMethod";
import { testStaticMethodWrapped } from "./methods/testStaticMethod";
import { TestObjectGetterMethod } from "./TestObjectGetterMethod";

export function invokeTestObjectGetterMethod(method: TestObjectGetterMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestObjectGetterMethod.Create:
      return createWrapped(buffer);
    case TestObjectGetterMethod.TestInstanceMethod:
      return testInstanceMethodWrapped(buffer);
    case TestObjectGetterMethod.TestStaticMethod:
      return testStaticMethodWrapped(buffer);
    default:
      throw new Error("Unknown method " + method.toString());
  }
}

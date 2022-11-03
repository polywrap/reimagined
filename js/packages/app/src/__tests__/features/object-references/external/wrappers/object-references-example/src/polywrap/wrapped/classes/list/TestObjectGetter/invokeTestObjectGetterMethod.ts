import { constructorWrapped } from "./methods/constructor";
import { testInstanceReceiveReferenceWrapped } from "./methods/testInstanceReceiveReference";
import { testStaticReceiveReferenceWrapped } from "./methods/testStaticReceiveReference";
import { TestObjectGetterMethod } from "./TestObjectGetterMethod";

export function invokeTestObjectGetterMethod(method: TestObjectGetterMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestObjectGetterMethod.Constructor:
      return constructorWrapped(buffer);
    case TestObjectGetterMethod.TestInstanceReceiveReference:
      return testInstanceReceiveReferenceWrapped(buffer);
    case TestObjectGetterMethod.TestStaticReceiveReference:
      return testStaticReceiveReferenceWrapped(buffer);
    default:
      throw new Error("Unknown method " + method.toString());
  }
}

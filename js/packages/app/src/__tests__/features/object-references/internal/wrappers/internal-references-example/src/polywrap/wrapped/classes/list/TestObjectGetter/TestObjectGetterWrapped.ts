import { stringify } from "@serial-as/json";
import { TestObjectGetter } from "../../../../..";
import { 
  createWrapped,
  testInstanceMethodWrapped,
  testStaticMethodWrapped,
} from "./methods";
import { TestObjectGetterMethod } from "./TestObjectGetterMethod";

const CLASS_NAME = "TestObjectGetter";

export class TestObjectGetterWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static invokeMethod(method: u32, buffer: ArrayBuffer): ArrayBuffer {  
    switch (method) {
      case TestObjectGetterMethod.Create:
        return createWrapped(buffer);
      case TestObjectGetterMethod.TestInstanceMethod:
        return testInstanceMethodWrapped(buffer);
      case TestObjectGetterMethod.TestStaticMethod:
        return testStaticMethodWrapped(buffer);
      default:
        throw new Error("Unknown method " + method.toString() + " on class " + CLASS_NAME);
    }
  }
  
  static mapToSerializable(value: TestObjectGetter): TestObjectGetterWrapped {
    return new TestObjectGetterWrapped(
      changetype<u32>(value)
    );
  }

  static serialize(value: TestObjectGetter): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestObjectGetterWrapped>(
        TestObjectGetterWrapped.mapToSerializable(value)
      )
    );
  }
}

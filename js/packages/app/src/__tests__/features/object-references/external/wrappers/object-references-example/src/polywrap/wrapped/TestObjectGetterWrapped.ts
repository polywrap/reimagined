import { stringify } from "@serial-as/json";
import { TestObjectGetter } from "../..";
import { 
  createWrapped,
  testStaticReceiveReferenceWrapped,
  testInstanceReceiveReferenceWrapped
} from "../wrapper/classes/list/TestObjectGetter/methods";
import { TestObjectGetterMethod } from "../wrapper/classes/list/TestObjectGetter/TestObjectGetterMethod";

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
      case TestObjectGetterMethod.TestInstanceReceiveReference:
        return testInstanceReceiveReferenceWrapped(buffer);
      case TestObjectGetterMethod.TestStaticReceiveReference:
        return testStaticReceiveReferenceWrapped(buffer);
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

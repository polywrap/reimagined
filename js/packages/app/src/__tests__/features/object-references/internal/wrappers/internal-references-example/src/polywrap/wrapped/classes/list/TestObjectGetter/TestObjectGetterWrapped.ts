import { stringify } from "@serial-as/json";
import { TestObjectGetter } from "../../../../..";
import { SerializableTestObjectGetter } from "./SerializableTestObjectGetter";
import { 
  createWrapped,
  testInstanceMethodWrapped,
  testStaticMethodWrapped
} from "./methods";
import { TestObjectGetterMethod } from "./TestObjectGetterMethod";

const CLASS_NAME = "TestObjectGetter";

export class TestObjectGetterWrapped {
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
  
  static mapToSerializable(value: TestObjectGetter): SerializableTestObjectGetter {
    return new SerializableTestObjectGetter(
      changetype<u32>(value)
    );
  }

  static serialize(value: TestObjectGetter): ArrayBuffer {
    return String.UTF8.encode(
      stringify<SerializableTestObjectGetter>(
        TestObjectGetterWrapped.mapToSerializable(value)
      )
    );
  }
}

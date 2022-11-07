import { stringify } from "@serial-as/json";
import { TestInternalClassMethod } from "./TestInternalClassMethod";
import { TestInternalClass } from "../../../../..";
import { SerializableTestInternalClass } from "./SerializableTestInternalClass";
import { 
  createWrapped, 
  testInstanceMethodWrapped 
} from "./methods";

const CLASS_NAME = "TestInternalClass";

export class TestInternalClassWrapped {
  static invokeMethod(method: u32, buffer: ArrayBuffer): ArrayBuffer {  
    switch (method) {
      case TestInternalClassMethod.Create:
        return createWrapped(buffer);
      case TestInternalClassMethod.TestInstanceMethod:
        return testInstanceMethodWrapped(buffer);
      default:
        throw new Error("Unknown method " + method.toString() + " on class " + CLASS_NAME);
    }
  }
  
  static mapToSerializable(value: TestInternalClass): SerializableTestInternalClass {
    return new SerializableTestInternalClass(
      changetype<u32>(value)
    );
  }

  static serialize(value: TestInternalClass): ArrayBuffer {
    return String.UTF8.encode(
      stringify<SerializableTestInternalClass>(
        TestInternalClassWrapped.mapToSerializable(value)
      )
    );
  }
}

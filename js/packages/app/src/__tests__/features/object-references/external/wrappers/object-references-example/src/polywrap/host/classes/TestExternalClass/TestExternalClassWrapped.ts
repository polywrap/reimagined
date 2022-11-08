import { stringify } from "@serial-as/json";
import { TestInternalClassMethod } from "./TestInternalClassMethod";
import { TestInternalClass } from "../../../../..";
import { 
  createWrapped, 
  testInstanceMethodWrapped
} from "./methods";

const CLASS_NAME = "TestInternalClass";

export class TestInternalClassWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

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
  
  static serialize(value: TestInternalClass): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestInternalClassWrapped>(
        TestInternalClassWrapped.mapToSerializable(value)
      )
    );
  }

  private static mapToSerializable(value: TestInternalClass): TestInternalClassWrapped {
    return new TestInternalClassWrapped(
      changetype<u32>(value)
    );
  }
}

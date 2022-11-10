import { stringify } from "@serial-as/json";
import { TestInternalClassMethod } from "./TestInternalClassMethod";
import { TestInternalClass } from "../../../../..";
import { 
  createWrapped, 
  testInstanceMethodWrapped
} from "./methods";
import { WrapModule } from "../../../../wrap/WrapModule";

const CLASS_NAME = "TestInternalClass";

export class TestInternalClassWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, TestInternalClass> = new Map<u32, TestInternalClass>();

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

  static dereference(referencePtr: u32): TestInternalClass {
    const object = TestInternalClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference TestInternalClass(${referencePtr}) not found`);
    }

    return object;
  }

  private static mapToSerializable(value: TestInternalClass): TestInternalClassWrapped {
    const referencePtr = WrapModule.wrapInstance.referenceCount++;

    this.referenceMap.set(referencePtr, value);
  
    return new TestInternalClassWrapped(
      referencePtr
    );
  }
}

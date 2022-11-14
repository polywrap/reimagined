import { stringify } from "@serial-as/json";
import { parse } from '@serial-as/json'
import { IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { TestInternalClass } from "../../..";

import { invoke } from './invoke';

const CLASS_NAME = "TestInternalClass";

export class TestInternalClassWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, TestInternalClass> = new Map<u32, TestInternalClass>();
  static referenceCount: u32 = 0;

  static dereference(referencePtr: u32): TestInternalClass {
    const object = TestInternalClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference TestInternalClass(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: TestInternalClass): TestInternalClassWrapped {
    const referencePtr = ++TestInternalClassWrapped.referenceCount;
    TestInternalClassWrapped.referenceMap.set(referencePtr, value);
  
    return new TestInternalClassWrapped(
      referencePtr,

    );
  }

  static serialize(value: TestInternalClass): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestInternalClassWrapped>(
        TestInternalClassWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestInternalClass {
    const object = parse<TestInternalClassWrapped>(String.UTF8.decode(buffer));
  
    return TestInternalClassWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestInternalClassWrapped, wrapInstance: IExternalWrapInstance): TestInternalClass {
    const object = new TestInternalClass(
      value.__referencePtr,

    );

    return object;
  }
}

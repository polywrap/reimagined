import { stringify } from "@serial-as/json";
import { parse } from '@serial-as/json'
import { IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { TestClass } from "../../..";

import { invoke } from './invoke';

const CLASS_NAME = "TestClass";

export class TestClassWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, TestClass> = new Map<u32, TestClass>();
  static referenceCount: u32 = 0;

  static dereference(referencePtr: u32): TestClass {
    const object = TestClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference TestClass(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: TestClass): TestClassWrapped {
    const referencePtr = ++TestClassWrapped.referenceCount;
    TestClassWrapped.referenceMap.set(referencePtr, value);
  
    return new TestClassWrapped(
      referencePtr,

    );
  }

  static serialize(value: TestClass): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestClassWrapped>(
        TestClassWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestClass {
    const object = parse<TestClassWrapped>(String.UTF8.decode(buffer));
  
    return TestClassWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestClassWrapped, wrapInstance: IExternalWrapInstance): TestClass {
    const object = new TestClass(
      value.__referencePtr,

    );

    return object;
  }
}

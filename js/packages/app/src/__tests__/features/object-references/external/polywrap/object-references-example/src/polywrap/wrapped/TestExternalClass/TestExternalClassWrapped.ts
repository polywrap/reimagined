import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { TestExternalClass } from "../../..";

import { invoke } from './invoke';

const CLASS_NAME = "TestExternalClass";

export class TestExternalClassWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<number, TestExternalClass> = new Map<number, TestExternalClass>();
  static referenceCount: number = 0;

  static dereference(referencePtr: number): TestExternalClass {
    const object = TestExternalClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference TestExternalClass(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: TestExternalClass): TestExternalClassWrapped {
    const referencePtr = ++TestExternalClassWrapped.referenceCount;

    TestExternalClassWrapped.referenceMap.set(referencePtr, value);
  
    return new TestExternalClassWrapped(
      referencePtr,

    );
  }

  static serialize(value: TestExternalClass): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestExternalClassWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: Uint8Array): TestExternalClass {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return TestExternalClassWrapped.mapFromSerializable(object);
  }

  static mapFromSerializable(value: TestExternalClassWrapped): TestExternalClass {
    return TestExternalClassWrapped.dereference(value.__referencePtr);
  }
}

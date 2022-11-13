import { IExternalWrapInstance } from "@nerfzael/reim-wrap-js";
import { TestObjectGetter } from "../../..";
import { TestExternalClassWrapped } from "..";

import { TestExternalClass } from "../..";


import { invoke } from './invoke';

const CLASS_NAME = "TestObjectGetter";

export class TestObjectGetterWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<u32, TestObjectGetter> = new Map<u32, TestObjectGetter>();

  static dereference(referencePtr: number): TestObjectGetter {
    const object = TestObjectGetterWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference TestObjectGetter(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Uint8Array {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: TestObjectGetter): TestObjectGetterWrapped {
    const referencePtr = changetype<u32>(value);
    this.referenceMap.set(referencePtr, value);
  
    return new TestObjectGetterWrapped(
      referencePtr,

    );
  }

  static serialize(value: TestObjectGetter): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestObjectGetterWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: Uint8Array): TestObjectGetter {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return TestObjectGetterWrapped.mapFromSerializable(object);
  }

  static mapFromSerializable(value: TestObjectGetterWrapped): TestObjectGetter {
    const object = new TestObjectGetter(
      value.__referencePtr,

    );

    return object;
  }
}

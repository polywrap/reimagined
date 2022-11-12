import { stringify } from "@serial-as/json";
import { parse } from '@serial-as/json'
import { IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { TestObjectGetter } from "../../..";
import { TestExternalClassWrapped } from "..";
import { TestExternalClass } from "../../external";


import { invoke } from './invoke';

const CLASS_NAME = "TestObjectGetter";

export class TestObjectGetterWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, TestObjectGetter> = new Map<u32, TestObjectGetter>();

  static dereference(referencePtr: u32): TestObjectGetter {
    const object = TestObjectGetterWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference TestObjectGetter(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: TestObjectGetter): TestObjectGetterWrapped {
    const referencePtr = changetype<u32>(value);
    this.referenceMap.set(referencePtr, value);
  
    return new TestObjectGetterWrapped(
      referencePtr,

    );
  }

  static serialize(value: TestObjectGetter): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestObjectGetterWrapped>(
        TestObjectGetterWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: ArrayBuffer): TestObjectGetter {
    const object = parse<TestObjectGetterWrapped>(String.UTF8.decode(buffer));
  
    return TestObjectGetterWrapped.mapFromSerializable(object);
  }

  static mapFromSerializable(value: TestObjectGetterWrapped): TestObjectGetter {
    const object = new TestObjectGetter(
      value.__referencePtr,

    );

    return object;
  }
}

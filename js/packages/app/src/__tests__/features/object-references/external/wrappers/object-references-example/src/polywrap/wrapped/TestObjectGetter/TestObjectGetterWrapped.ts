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
  static referenceCount: u32 = 0;

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
    const referencePtr = ++TestObjectGetterWrapped.referenceCount;
    TestObjectGetterWrapped.referenceMap.set(referencePtr, value);
  
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

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestObjectGetter {
    const object = parse<TestObjectGetterWrapped>(String.UTF8.decode(buffer));
  
    return TestObjectGetterWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestObjectGetterWrapped, wrapInstance: IExternalWrapInstance): TestObjectGetter {
    return TestExternalClassWrapped.dereference(value.__referencePtr);
  }
}

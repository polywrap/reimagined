import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { WrapModule } from "../../external/module/WrapModule";
import { TestObjectGetter } from "../../external/classes/TestObjectGetter";
import { TestInternalClassWrapped } from "..";


const CLASS_NAME = "TestObjectGetter";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: number,
    public instance: TestObjectGetter
  ) {
  }
}

export class TestObjectGetterWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<TestObjectGetter, InstanceWithExternalReferencePtr> = new Map<TestObjectGetter, InstanceWithExternalReferencePtr>();
  static referenceCount: number = 0;

  static dereference(referencePtr: TestObjectGetter): TestObjectGetter {
    const object = TestObjectGetterWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }

    return object.instance;
  }

  static deleteReference(referencePtr: TestObjectGetter): void {
    const success = TestObjectGetterWrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}. Not found`);
    }
  }

  static serialize(value: TestObjectGetter): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestObjectGetterWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestObjectGetter): TestObjectGetterWrapped {
    const referencePtr = value;
    const existingReference = TestObjectGetterWrapped.referenceMap.get(referencePtr);

    if (!existingReference) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }
  
    return new TestObjectGetterWrapped(
      existingReference.externalReferencePtr,

    );
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestObjectGetter {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return TestObjectGetterWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestObjectGetterWrapped, wrapInstance: IExternalWrapInstance): TestObjectGetter {
    const object = new TestObjectGetter(
      value.__referencePtr,
      wrapInstance,

    );

    const referencePtr = object;
  
    this.referenceMap.set(
      referencePtr, 
      new InstanceWithExternalReferencePtr(
        value.__referencePtr, 
        object
      )
    );  

    return object;
  }
}

import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { WrapModule } from "../../external/module/WrapModule";
import { TestInternalClass } from "../../external/classes/TestInternalClass";


const CLASS_NAME = "TestInternalClass";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: number,
    public instance: TestInternalClass
  ) {
  }
}

export class TestInternalClassWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<TestInternalClass, InstanceWithExternalReferencePtr> = new Map<TestInternalClass, InstanceWithExternalReferencePtr>();
  static referenceCount: number = 0;

  static dereference(referencePtr: TestInternalClass): TestInternalClass {
    const object = TestInternalClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }

    return object.instance;
  }

  static deleteReference(referencePtr: TestInternalClass): void {
    const success = TestInternalClassWrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}. Not found`);
    }
  }

  static serialize(value: TestInternalClass): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestInternalClassWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestInternalClass): TestInternalClassWrapped {
    const referencePtr = value;
    const existingReference = TestInternalClassWrapped.referenceMap.get(referencePtr);

    if (!existingReference) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }
  
    return new TestInternalClassWrapped(
      existingReference.externalReferencePtr,

    );
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestInternalClass {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return TestInternalClassWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestInternalClassWrapped, wrapInstance: IExternalWrapInstance): TestInternalClass {
    const object = new TestInternalClass(
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

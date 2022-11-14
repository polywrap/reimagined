import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { WrapModule } from "../../external/module/WrapModule";
import { TestClass } from "../../external/classes/TestClass";


const CLASS_NAME = "TestClass";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: number,
    public instance: TestClass
  ) {
  }
}

export class TestClassWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<TestClass, InstanceWithExternalReferencePtr> = new Map<TestClass, InstanceWithExternalReferencePtr>();
  static referenceCount: number = 0;

  static dereference(referencePtr: TestClass): TestClass {
    const object = TestClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }

    return object.instance;
  }

  static deleteReference(referencePtr: TestClass): void {
    const success = TestClassWrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}. Not found`);
    }
  }

  static serialize(value: TestClass): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestClassWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestClass): TestClassWrapped {
    const referencePtr = value;
    const existingReference = TestClassWrapped.referenceMap.get(referencePtr);

    if (!existingReference) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }
  
    return new TestClassWrapped(
      existingReference.externalReferencePtr,

    );
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestClass {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return TestClassWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestClassWrapped, wrapInstance: IExternalWrapInstance): TestClass {
    const object = new TestClass(
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

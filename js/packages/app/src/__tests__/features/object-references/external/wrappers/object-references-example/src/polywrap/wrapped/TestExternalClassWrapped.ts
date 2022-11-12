import { parse, stringify } from "@serial-as/json";
import { TestExternalClass } from "../external/classes/TestExternalClass";
import { IWrapInstance } from "@nerfzael/reim-wrap-as";

const CLASS_NAME = "TestExternalClass";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: u32,
    public instance: TestExternalClass
  ) {
  }
}

export class TestExternalClassWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, InstanceWithExternalReferencePtr> = new Map<u32, InstanceWithExternalReferencePtr>();

  static dereference(referencePtr: u32): TestExternalClass {
    const object = TestExternalClassWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}(${referencePtr}). Not found`);
    }

    return object;
  }

  static deleteReference(referencePtr: u32): void {
    const success = TestExternalClassWrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}(${referencePtr}). Not found`);
    }
  }

  static serialize(value: TestExternalClass): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestExternalClassWrapped>(
        TestExternalClassWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestExternalClass): TestExternalClassWrapped {
    const referencePtr = changetype<u32>(value);
    const externalReferencePtr = this.referenceMap.get(referencePtr);

    if (!externalReferencePtr) {
      throw new Error(`Could not find external reference of ${CLASS_NAME}(${referencePtr}).`);
    }
  
    return new TestExternalClassWrapped(
      externalReferencePtr,
    );
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IWrapInstance): TestExternalClass {
    const object = parse<TestExternalClassWrapped>(String.UTF8.decode(buffer));
  
    return TestExternalClassWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestExternalClassWrapped, wrapInstance: IWrapInstance): TestExternalClass {
    const object = new TestExternalClass(
      value.__referencePtr,
      wrapInstance,
    );

    const referencePtr = changetype<u32>(value);
  
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

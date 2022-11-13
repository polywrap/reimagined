import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { WrapModule } from "../../external/module/WrapModule";
import { TestObject2 } from "../../external/classes/TestObject2";


const CLASS_NAME = "TestObject2";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: number,
    public instance: TestObject2
  ) {
  }
}

export class TestObject2Wrapped {
  constructor(
    public __referencePtr: number,
    public str2: string,
    public num2: u32,
  ) {
  }

  static referenceMap: Map<u32, InstanceWithExternalReferencePtr> = new Map<u32, InstanceWithExternalReferencePtr>();

  static dereference(referencePtr: number): TestObject2 {
    const object = TestObject2Wrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}(${referencePtr}). Not found`);
    }

    return object.instance;
  }

  static deleteReference(referencePtr: number): void {
    const success = TestObject2Wrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}(${referencePtr}). Not found`);
    }
  }

  static serialize(value: TestObject2): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestObject2Wrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestObject2): TestObject2Wrapped {
    const referencePtr = changetype<u32>(value);
    const existingReference = this.referenceMap.get(referencePtr);

    if (!existingReference) {
      throw new Error(`Could not find external reference of ${CLASS_NAME}(${referencePtr}).`);
    }
  
    return new TestObject2Wrapped(
      existingReference.externalReferencePtr,
            
      value.str2,
                  
      value.num2,
      
    );
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestObject2 {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return TestObject2Wrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: TestObject2Wrapped, wrapInstance: IExternalWrapInstance): TestObject2 {
    const object = new TestObject2(
      value.__referencePtr,
      wrapInstance,
            
      value.str2,
                  
      value.num2,
      
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

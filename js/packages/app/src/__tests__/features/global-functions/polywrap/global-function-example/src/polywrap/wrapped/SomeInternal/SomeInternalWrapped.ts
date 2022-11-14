import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { WrapModule } from "../../external/module/WrapModule";
import { SomeInternal } from "../../external/classes/SomeInternal";


const CLASS_NAME = "SomeInternal";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: number,
    public instance: SomeInternal
  ) {
  }
}

export class SomeInternalWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<SomeInternal, InstanceWithExternalReferencePtr> = new Map<SomeInternal, InstanceWithExternalReferencePtr>();
  static referenceCount: number = 0;

  static dereference(referencePtr: SomeInternal): SomeInternal {
    const object = SomeInternalWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }

    return object.instance;
  }

  static deleteReference(referencePtr: SomeInternal): void {
    const success = SomeInternalWrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}. Not found`);
    }
  }

  static serialize(value: SomeInternal): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        SomeInternalWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: SomeInternal): SomeInternalWrapped {
    const referencePtr = value;
    const existingReference = SomeInternalWrapped.referenceMap.get(referencePtr);

    if (!existingReference) {
      throw new Error(`Could not dereference ${CLASS_NAME}. Not found`);
    }
  
    return new SomeInternalWrapped(
      existingReference.externalReferencePtr,

    );
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): SomeInternal {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return SomeInternalWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: SomeInternalWrapped, wrapInstance: IExternalWrapInstance): SomeInternal {
    const object = new SomeInternal(
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

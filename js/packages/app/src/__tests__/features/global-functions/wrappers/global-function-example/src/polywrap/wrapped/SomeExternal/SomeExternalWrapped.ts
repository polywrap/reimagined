import { parse, stringify } from "@serial-as/json";
import { IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { WrapModule } from "../../external/module/WrapModule";
import { SomeExternal } from "../../external/classes/SomeExternal";


const CLASS_NAME = "SomeExternal";

class InstanceWithExternalReferencePtr {
  constructor(
    public externalReferencePtr: u32,
    public instance: SomeExternal
  ) {
  }
}

export class SomeExternalWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, InstanceWithExternalReferencePtr> = new Map<u32, InstanceWithExternalReferencePtr>();

  static dereference(referencePtr: u32): SomeExternal {
    const object = SomeExternalWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Could not dereference ${CLASS_NAME}(${referencePtr}). Not found`);
    }

    return object.instance;
  }

  static deleteReference(referencePtr: u32): void {
    const success = SomeExternalWrapped.referenceMap.delete(referencePtr);

    if (!success) {
      throw new Error(`Could not delete reference ${CLASS_NAME}(${referencePtr}). Not found`);
    }
  }

  static serialize(value: SomeExternal): ArrayBuffer {
    return String.UTF8.encode(
      stringify<SomeExternalWrapped>(
        SomeExternalWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: SomeExternal): SomeExternalWrapped {
    const referencePtr = changetype<u32>(value);
    const existingReference = SomeExternalWrapped.referenceMap.get(referencePtr);

    if (!existingReference) {
      throw new Error(`Could not find external reference of ${CLASS_NAME}(${referencePtr}).`);
    }
  
    return new SomeExternalWrapped(
      existingReference.externalReferencePtr,

    );
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): SomeExternal {
    const object = parse<SomeExternalWrapped>(String.UTF8.decode(buffer));
  
    return SomeExternalWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: SomeExternalWrapped, wrapInstance: IExternalWrapInstance): SomeExternal {
    const object = new SomeExternal(
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

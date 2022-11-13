import { stringify } from "@serial-as/json";
import { parse } from '@serial-as/json'
import { IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { SomeInternal } from "../../..";

import { invoke } from './invoke';

const CLASS_NAME = "SomeInternal";

export class SomeInternalWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }

  static referenceMap: Map<u32, SomeInternal> = new Map<u32, SomeInternal>();
  static referenceCount: u32 = 0;

  static dereference(referencePtr: u32): SomeInternal {
    const object = SomeInternalWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference SomeInternal(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: SomeInternal): SomeInternalWrapped {
    const referencePtr = ++SomeInternalWrapped.referenceCount;
    SomeInternalWrapped.referenceMap.set(referencePtr, value);
  
    return new SomeInternalWrapped(
      referencePtr,

    );
  }

  static serialize(value: SomeInternal): ArrayBuffer {
    return String.UTF8.encode(
      stringify<SomeInternalWrapped>(
        SomeInternalWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): SomeInternal {
    const object = parse<SomeInternalWrapped>(String.UTF8.decode(buffer));
  
    return SomeInternalWrapped.mapFromSerializable(object, wrapInstance);
  }

  static mapFromSerializable(value: SomeInternalWrapped, wrapInstance: IExternalWrapInstance): SomeInternal {
    const object = new SomeInternal(
      value.__referencePtr,

    );

    return object;
  }
}

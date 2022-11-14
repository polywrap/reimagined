import { IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { SomeExternal } from "../../..";

import { invoke } from './invoke';

const CLASS_NAME = "SomeExternal";

export class SomeExternalWrapped {
  constructor(
    public __referencePtr: number,
  ) {
  }

  static referenceMap: Map<number, SomeExternal> = new Map<number, SomeExternal>();
  static referenceCount: number = 0;

  static dereference(referencePtr: number): SomeExternal {
    const object = SomeExternalWrapped.referenceMap.get(referencePtr);

    if (!object) {
      throw new Error(`Reference SomeExternal(${referencePtr}) not found on class: ${CLASS_NAME}`);
    }

    return object;
  }

  static invokeMethod(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {  
    return invoke(buffer, wrapInstance);
  }
  
  static mapToSerializable(value: SomeExternal): SomeExternalWrapped {
    const referencePtr = ++SomeExternalWrapped.referenceCount;

    SomeExternalWrapped.referenceMap.set(referencePtr, value);
  
    return new SomeExternalWrapped(
      referencePtr,

    );
  }

  static serialize(value: SomeExternal): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        SomeExternalWrapped.mapToSerializable(value)
      )
    );
  }

  static deserialize(buffer: Uint8Array): SomeExternal {
    const object = JSON.parse(new TextDecoder().decode(buffer));
  
    return SomeExternalWrapped.mapFromSerializable(object);
  }

  static mapFromSerializable(value: SomeExternalWrapped): SomeExternal {
    const object = new SomeExternal(
      value.__referencePtr,

    );

    return object;
  }
}

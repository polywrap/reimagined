import { bufferToU32, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { TestInternalClassWrapped } from "../../wrapped";

import { TestObjectGetterWrapped } from "../../wrapped";


export function invokeClassMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
  const classId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (classId) {
    
    case WrapManifest.Internal.Class.TestInternalClass:
      return TestInternalClassWrapped.invokeMethod(dataBuffer, wrapInstance);
    
    
    case WrapManifest.Internal.Class.TestObjectGetter:
      return TestObjectGetterWrapped.invokeMethod(dataBuffer, wrapInstance);
    
    default:
      throw new Error("Unknown class ID: " + classId.toString());
  }
}

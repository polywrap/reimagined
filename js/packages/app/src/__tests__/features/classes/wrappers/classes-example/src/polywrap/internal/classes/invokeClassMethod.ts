import { bufferToU32, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';



import { TestClassWrapped } from "../../wrapped";


export function invokeClassMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
  const classId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (classId) {
    
    
    
    
    case WrapManifest.Internal.Class.TestClass:
      return TestClassWrapped.invokeMethod(dataBuffer, wrapInstance);
    
    default:
      throw new Error("Unknown class ID: " + classId.toString());
  }
}

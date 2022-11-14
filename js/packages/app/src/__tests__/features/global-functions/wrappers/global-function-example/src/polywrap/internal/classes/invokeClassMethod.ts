import { bufferToU32, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';




export function invokeClassMethod(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
  const classId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (classId) {
    
    
    
    default:
      throw new Error("Unknown class ID: " + classId.toString());
  }
}

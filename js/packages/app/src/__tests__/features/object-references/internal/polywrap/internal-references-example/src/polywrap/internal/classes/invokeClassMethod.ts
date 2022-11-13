import { bufferToU32, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';



export function invokeClassMethod(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const classId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (classId) {
    
    
    
    
    default:
      throw new Error("Unknown class ID: " + classId.toString());
  }
}

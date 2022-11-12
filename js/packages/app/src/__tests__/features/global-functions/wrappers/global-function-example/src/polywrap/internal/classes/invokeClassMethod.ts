import { bufferToU32 } from "@polywrap/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';




export function invokeClassMethod(buffer: ArrayBuffer): ArrayBuffer {
  const classId = bufferToU32(buffer);
  const method = bufferToU32(buffer, 4);
  const dataBuffer = buffer.slice(8);

  switch (classId) {
    
    
    
    default:
      throw new Error("Unknown class ID: " + classId);
  }
}

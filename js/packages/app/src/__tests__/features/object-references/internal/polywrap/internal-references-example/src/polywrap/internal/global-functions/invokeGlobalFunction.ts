import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { 
     
} from "../../..";
import { TestInternalClassWrapped } from "../../wrapped";
import { TestInternalClass } from "../../external";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
        
    default:
      throw new Error("Unknown function/method: " + funcId.toString());
  }
}



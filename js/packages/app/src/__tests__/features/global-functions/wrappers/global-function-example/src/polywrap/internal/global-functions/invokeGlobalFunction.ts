import { parse } from '@serial-as/json'
import { bufferToU32 } from "@polywrap/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { 
 
} from "../../..";

import { BaseTypeSerialization } from '../../serialization/BaseTypeSerialization';

export function invoke(buffer: ArrayBuffer): ArrayBuffer {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    default:
      throw new Error("Unknown function/method: " + funcId);
  }
}


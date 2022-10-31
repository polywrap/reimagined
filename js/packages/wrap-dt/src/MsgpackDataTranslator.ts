import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { IDataTranslator } from "./IDataTranslator";


export class MsgpackDataTranslator implements IDataTranslator {
  encode<T>(data: T): Uint8Array {
    return msgpackEncode(data);
  }

  decode<T>(buffer: Uint8Array): T {
    return msgpackDecode(buffer) as T;
  }
}

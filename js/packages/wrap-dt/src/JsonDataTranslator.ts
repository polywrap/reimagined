import { IDataTranslator } from "./IDataTranslator";


export class JsonDataTranslator implements IDataTranslator {
  encode<T>(data: T): Uint8Array {
    return new TextEncoder().encode(JSON.stringify(data));
  }

  decode<T>(buffer: Uint8Array): T {
    return JSON.parse(new TextDecoder().decode(buffer)) as T;
  }
}

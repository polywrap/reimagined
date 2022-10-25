
export interface IDataTranslator {
  encode: <T>(data: T) => Uint8Array;
  decode: <T>(data: Uint8Array) => T;
}

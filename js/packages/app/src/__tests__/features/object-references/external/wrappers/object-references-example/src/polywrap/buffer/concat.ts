import { DataView } from "./DataView";

export function concat(dataBuffer1: ArrayBuffer, dataBuffer2: ArrayBuffer): ArrayBuffer {
  // var tmp = new Uint8Array(dataBuffer1.byteLength + dataBuffer2.byteLength);
  // tmp.set<ArrayBuffer>(dataBuffer1, 0);
  // tmp.set<ArrayBuffer>(dataBuffer2, dataBuffer1.byteLength);

  const buffer = new ArrayBuffer(dataBuffer1.byteLength + dataBuffer2.byteLength);
  const encoder = new DataView(buffer, 0, dataBuffer1.byteLength + dataBuffer2.byteLength);
  encoder.setBytes(dataBuffer1);
  encoder.setBytes(dataBuffer2);

  return encoder.buffer;
  // return tmp.buffer;
}

import { DataView } from "./DataView";

export function bufferToU32(buffer: ArrayBuffer, offset: u32 = 0): u32 {
  const view = new DataView(buffer, offset, buffer.byteLength - offset);
  const num = view.getUint32();

  return num;
}
import { Context } from "./Context";
import { DataView } from "./DataView";

export function bufferToU32(buffer: ArrayBuffer): u32 {
  const view = new DataView(buffer, 0, 4, new Context());
  const num = view.getUint32();

  return num;
}
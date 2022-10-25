import { Context } from "./Context";
import { DataView } from "./DataView";

export function u32ToBuffer(num: u32): ArrayBuffer {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer, 0, 4, new Context());
    view.setUint32(num);
  
    return buffer;
  }
  
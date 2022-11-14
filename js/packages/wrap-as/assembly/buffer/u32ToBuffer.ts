export function u32ToBuffer(num: u32): ArrayBuffer {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, num);
  
    return buffer;
  }
  
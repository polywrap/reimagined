export const u32ToBuffer = (num: number): Uint8Array => {
  let b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, num);

  return b;
};

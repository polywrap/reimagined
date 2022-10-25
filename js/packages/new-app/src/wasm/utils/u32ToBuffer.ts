export const u32ToBuffer = (u32Number: number): Uint8Array => {
  let buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, u32Number);
  const resourceIdBuffer = new Uint8Array(buffer);

  return resourceIdBuffer;
}

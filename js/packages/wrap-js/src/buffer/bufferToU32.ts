export const bufferToU32 = (buffer: Uint8Array, offset: number = 0): number => {
  return new DataView(buffer.buffer, offset).getUint32(0);
};

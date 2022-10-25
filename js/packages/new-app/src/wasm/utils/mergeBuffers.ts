export const mergeBuffers = (buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array => {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);

  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);

  return tmp;
}

export const concat = (array: Uint8Array[]): Uint8Array => {
  const totalLength = array.reduce((acc, cur) => acc + cur.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const item of array) {
    result.set(new Uint8Array(item), offset);
    offset += item.byteLength;
  }

  return result;
};

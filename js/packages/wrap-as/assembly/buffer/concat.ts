import { DataView } from "./DataView";

export const concat = (array: ArrayBuffer[]): ArrayBuffer => {
  const totalLength = array.reduce((acc, cur) => acc + cur.byteLength, 0);
  const result = new ArrayBuffer(totalLength);
  const encoder = new DataView(result, 0, totalLength);

  for (let i = 0; i < array.length; i++) {
    encoder.setBytes(array[i]);
  }

  return encoder.buffer;
};

export const stringToBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

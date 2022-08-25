import { IFileReader } from "@polywrap/reim-wrap";

export class EmbeddedFileReader implements IFileReader{
  constructor(private readonly manifest: Uint8Array, private readonly module: Uint8Array) {
  }

  async getFile(path: string): Promise<Uint8Array | undefined> {
    if(path === "wrap.info") {
      return this.manifest;
    } else if (path === "wrap.wasm") {
      return this.module;
    } else {
      return undefined;
    }
  } 
}

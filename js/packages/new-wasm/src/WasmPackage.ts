import { IWrapManifest, IWrapInstance, IFileReader } from "@polywrap/reim-new-wrap";
import { IWasmPackage } from "./IWasmPackage";
import { WasmInstance } from "./WasmInstance";

export class WasmPackage implements IWasmPackage {
  constructor(public readonly reader: IFileReader) {
  }

  async getManifest(): Promise<IWrapManifest> {
    const manifestBytes = await this.reader.getFile("wrap.info");
    console.log("aaaaaaaa", manifestBytes);
    console.log("bbbbbbb", new TextDecoder().decode(manifestBytes));
    const manifest = JSON.parse(new TextDecoder().decode(manifestBytes));
    console.log("cccc",manifest);

    return {
      name: "test",
      abi: manifest
    } as IWrapManifest;
  }

  async getWasmModule(): Promise<Uint8Array | undefined> {
    return await this.reader.getFile("wrap.wasm");
  }

  async createWrapper(): Promise<IWrapInstance> {
    const manifest = await this.getManifest();
    const wasmModule = await this.getWasmModule();

    if(!wasmModule) {
      throw new Error("Wasm module not found");
    }
    
    return await WasmInstance.create(manifest, wasmModule, {});
  }
}
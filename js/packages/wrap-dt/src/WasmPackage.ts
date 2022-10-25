import { IWrapManifest, IWrapper, IFileReader } from "@polywrap/reim-wrap";
import { IWasmPackage } from "./IWasmPackage";
import { WasmWrapper } from "./WasmWrapper";
import { IDtInstanceBuilder } from "./IDtInstanceBuilder";
import { IDataTranslator } from "./IDataTranslator";
import { IDtReceiver } from "./IDtReceiver";
import { Result } from "@polywrap/result";

export class WasmPackage implements IWasmPackage {
  constructor(
    private readonly manifest: IWrapManifest, 
    private readonly dtInstanceBuilder: IDtInstanceBuilder, 
    private readonly dataTranslator: IDataTranslator,
    private readonly dtReceiver: IDtReceiver,
    public readonly reader: IFileReader
  ) {
  }

  async getManifest(): Promise<IWrapManifest> {
    return this.manifest;
  }

  async getWasmModule(): Promise<Result<Uint8Array, Error>> {
    return await this.reader.readFile("wrap.wasm");
  }

  async createWrapper(): Promise<IWrapper> {
    const moduleResult = await this.getWasmModule();

    if (!moduleResult.ok) {
      throw moduleResult.error;
    }
    
    const dtInstance = await this.dtInstanceBuilder.build(moduleResult.value);

    return new WasmWrapper(
      this.manifest,
      dtInstance,
      this.dataTranslator,
      this.dtReceiver
    );
  }
}

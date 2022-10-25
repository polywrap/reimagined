import { IWrapManifest, IFileReader } from "@polywrap/reim-wrap";
import { IWasmPackage } from "./IWasmPackage";
import { IManifestFeatureManager } from "./IManifestFeatureManager";
import { IDtInstanceBuilder } from "./IDtInstanceBuilder";
import { WasmPackage } from "./WasmPackage";
import { Result } from "@polywrap/result";
import { ResultOk } from "@polywrap/result";

export class WasmPackageBuilder {
  constructor(
    private readonly dtInstanceBuilder: IDtInstanceBuilder,
    private readonly manifestFeatureManager: IManifestFeatureManager
  ) {
  }

  async build(
    fileReader: IFileReader
  ): Promise<Result<IWasmPackage, Error>> {
    const manifestResult = await fileReader.readFile("wrap.info");
    if (!manifestResult.ok) {
      return manifestResult;
    }
 
    const manifest = JSON.parse(new TextDecoder().decode(manifestResult.value)) as IWrapManifest;

    const dataTranslator = this.manifestFeatureManager.getDataTranslator(manifest);
    const dtReceiver = this.manifestFeatureManager.getDtReceiver(manifest);

    return ResultOk(new WasmPackage(manifest, this.dtInstanceBuilder, dataTranslator, dtReceiver, fileReader));
  }
}

import { IPackageLoader } from "@polywrap/reim-loader";
import { IWrapPackage, IWrapManifest } from "@polywrap/reim-wrap";

import fs from "fs";
import { WasmPackageBuilder } from "../WasmPackageBuilder";
import { DtInstanceBuilder } from "../DtInstanceBuilder";
import { ManifestFeatureManager } from "../ManifestFeatureManager";
import { composeFileReader } from "../helpers/composeFileReader";
import { Result } from "@polywrap/result";

const hardCodedManifest: IWrapManifest = {
  version: "0.1.0",
  abi: [
    {
      type: "function",
      name: "simpleMethod",
      args: [
        {
          name: "arg",
          typeName: "string"
        }
      ],
      returnType: "string"
    }
  ]
};

export class FileSystemLoader implements IPackageLoader {
  async load(packagePath: string): Promise<Result<IWrapPackage, Error>> {
    const manifestBuffer = await fs.promises.readFile(`${packagePath}/wrap.info`);
    const moduleBuffer = await fs.promises.readFile(`${packagePath}/wrap.wasm`);

    const dtInstanceBuilder = new DtInstanceBuilder();
    const manifestFeatureManager = new ManifestFeatureManager();

    const packageBuilder = new WasmPackageBuilder(dtInstanceBuilder, manifestFeatureManager);

    return packageBuilder.build(composeFileReader(manifestBuffer, moduleBuffer));
  }
}

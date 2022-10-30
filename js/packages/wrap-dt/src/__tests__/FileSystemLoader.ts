import { IPackageLoader } from "@polywrap/reim-loader";
import { IWrapPackage } from "@polywrap/reim-wrap";
import { Result } from "@polywrap/result";
import fs from "fs";

import { WasmPackageBuilder } from "../WasmPackageBuilder";
import { ManifestFeatureManager } from "../ManifestFeatureManager";
import { composeFileReader } from "../helpers/composeFileReader";
import { DtInstanceBuilder } from "./DtInstanceBuilder";

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

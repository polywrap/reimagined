import { EmbeddedPackage } from "@polywrap/reim-new-wasm";
import { IPackageLoader } from "@polywrap/reim-loader";
import { IWrapPackage } from "@polywrap/reim-wrap";

import fs from "fs";

export class FileSystemLoader implements IPackageLoader {
  async load(packagePath: string): Promise<IWrapPackage> {
    // const manifestBuffer = await fs.promises.readFile(`${packagePath}/wrap.info`);
    const manifestBuffer = new Uint8Array();
    const moduleBuffer = await fs.promises.readFile(`${packagePath}/wrap.wasm`);

    return new EmbeddedPackage(manifestBuffer, moduleBuffer);
  }
}

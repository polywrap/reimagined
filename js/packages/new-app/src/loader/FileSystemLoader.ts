import fs from "fs";
import { EmbeddedPackage } from "../wasm/EmbeddedPackage";
import { IPackageLoader } from "./IPackageLoader";

export class FileSystemLoader implements IPackageLoader {
  async load(packagePath: string): Promise<IWrapPackage> {
    const manifestBuffer = await fs.promises.readFile(`${packagePath}/wrap.info`);
    const moduleBuffer = await fs.promises.readFile(`${packagePath}/wrap.wasm`);

    return new EmbeddedPackage(manifestBuffer, moduleBuffer);
  }
}

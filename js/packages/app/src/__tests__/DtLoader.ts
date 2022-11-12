import { DtInstance } from "@polywrap/reim-dt-wasm";
import fs from "fs";
import { IDtInstance } from "@polywrap/reim-dt";

export class DtLoader {
  async load(packagePath: string): Promise<IDtInstance> {
    const moduleBuffer = await fs.promises.readFile(`${packagePath}/wrap.wasm`);

    return await DtInstance.create(moduleBuffer);
  }
}

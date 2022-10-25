import { DtInstance } from "@polywrap/reim-dt-wasm";
import { IDtInstanceBuilder } from "./IDtInstanceBuilder";


export class DtInstanceBuilder implements IDtInstanceBuilder {
  async build(wasmModule: Uint8Array): Promise<DtInstance> {
    return await DtInstance.create(wasmModule);
  }
}

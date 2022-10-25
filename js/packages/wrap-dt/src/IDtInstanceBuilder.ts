import { IDtInstance } from "@polywrap/reim-dt";


export interface IDtInstanceBuilder {
  build(wasmModule: Uint8Array): Promise<IDtInstance>;
}

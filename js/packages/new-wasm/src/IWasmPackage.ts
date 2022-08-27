import { IWrapPackage } from "@polywrap/reim-new-wrap";

export interface IWasmPackage extends IWrapPackage {
  getWasmModule(): Promise<Uint8Array | undefined>;
}
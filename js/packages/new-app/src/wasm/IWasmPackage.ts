import { IWrapPackage } from "@polywrap/reim-wrap";

export interface IWasmPackage extends IWrapPackage {
  getWasmModule(): Promise<Uint8Array | undefined>;
}
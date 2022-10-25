import { IWrapPackage } from "@polywrap/reim-wrap";
import { Result } from "@polywrap/result";

export interface IWasmPackage extends IWrapPackage {
  getWasmModule(): Promise<Result<Uint8Array, Error>>;
}
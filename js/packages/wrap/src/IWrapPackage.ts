import { IWrapper } from "./IWrapper";
import { IWrapManifest } from "./manifest";

export interface IWrapPackage {
  getManifest(): Promise<IWrapManifest>;
  createWrapper(): Promise<IWrapper>;
}
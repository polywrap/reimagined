import { IWrapInstance } from "./IWrapInstance";
import { IWrapManifest } from "./manifest/IWrapManifest";

export interface IWrapPackage {
  getManifest(): Promise<IWrapManifest>;
  createWrapper(): Promise<IWrapInstance>;
}
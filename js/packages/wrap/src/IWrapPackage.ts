import { IWrapInstance } from "./IWrapInstance";
import { IWrapManifest } from "./IWrapManifest";

export interface IWrapPackage {
  getManifest(): Promise<IWrapManifest>;
  createWrapper(): Promise<IWrapInstance>;
}
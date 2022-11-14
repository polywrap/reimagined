import { IDtInstance } from "@polywrap/reim-dt";
import { IWrapInstance } from "./IWrapInstance";
import { IWrapper } from "./IWrapper";
import { IWrapManifest } from "./manifest";

export interface IWrapPackage {
  getManifest(): Promise<IWrapManifest>;
  createWrapper(internalInstance?: IWrapInstance): Promise<IWrapper>;
  createInstance(): Promise<IDtInstance>;
}

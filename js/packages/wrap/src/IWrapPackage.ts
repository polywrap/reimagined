import { IDtInstance } from "@polywrap/reim-dt";
import { IHost } from "./IHost";
import { IWrapper } from "./IWrapper";
import { IWrapManifest } from "./manifest";

export interface IWrapPackage {
  getManifest(): Promise<IWrapManifest>;
  createWrapper(host?: IHost): Promise<IWrapper>;
  createInstance(): Promise<IDtInstance>;
}

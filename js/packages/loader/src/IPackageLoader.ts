import { IWrapPackage } from "@polywrap/reim-wrap";

export interface IPackageLoader {
  load(packagePath: string): Promise<IWrapPackage>
}
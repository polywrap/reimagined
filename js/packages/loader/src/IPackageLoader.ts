import { IWrapPackage } from "@polywrap/reim-wrap";
import { Result } from "@polywrap/result";

export interface IPackageLoader {
  load(packagePath: string): Promise<Result<IWrapPackage, Error>>;
}
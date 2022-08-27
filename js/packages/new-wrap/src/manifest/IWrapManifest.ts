import { AbiItem } from "./AbiItem";

export interface IWrapManifest {
  // Is name required?
  name: string;
  abi: AbiItem[];
}

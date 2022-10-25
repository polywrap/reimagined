import { IDataTranslator } from "./IDataTranslator";
import { IDtReceiver } from "./IDtReceiver";
import { IWrapManifest } from "@polywrap/reim-wrap";


export interface IManifestFeatureManager {
  getDataTranslator(manifest: IWrapManifest): IDataTranslator;
  getDtReceiver(manifest: IWrapManifest): IDtReceiver;
}

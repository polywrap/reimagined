import { IWrapManifest } from "@polywrap/reim-wrap";
import { IDataTranslator } from "./IDataTranslator";
import { IDtReceiver } from "./IDtReceiver";
import { IManifestFeatureManager } from "./IManifestFeatureManager";
import { JsonDataTranslator } from "./JsonDataTranslator";
import { DtReceiver } from "./DtReceiver";

export class ManifestFeatureManager implements IManifestFeatureManager {
  getDataTranslator(manifest: IWrapManifest): IDataTranslator {
    switch (manifest.version) {
      default:
        return new JsonDataTranslator();
    }
  }

  getDtReceiver(manifest: IWrapManifest): IDtReceiver {
    switch (manifest.version) {
      default:
        return new DtReceiver();
    }
  }
}

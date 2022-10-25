import { IWrapManifest } from "@polywrap/reim-wrap";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { IDataTranslator } from "./IDataTranslator";
import { IDtReceiver } from "./IDtReceiver";
import { IManifestFeatureManager } from "./IManifestFeatureManager";
import { HostFunction } from "./HostFunction";
import { bufferToU32 } from "./WasmWrapper";

export class MsgpackDataTranslator implements IDataTranslator {
  encode<T>(data: T): Uint8Array {
    return msgpackEncode(data);
  }

  decode<T>(buffer: Uint8Array): T {
    return msgpackDecode(buffer) as T;
  }
}

export class DtReceiver implements IDtReceiver {
  async onReceive(buffer: Uint8Array): Promise<Uint8Array> {
    const func: HostFunction = bufferToU32(buffer);
    switch (func) {
      case HostFunction.Log:
        console.log("aAAAAAAAaaaaAAAAAAAAa");
        console.log(buffer.slice(4, buffer.length), new TextDecoder().decode(buffer.slice(4, buffer.length)));

        return new Uint8Array();
    }

    return new Uint8Array();
  }
}

export class ManifestFeatureManager implements IManifestFeatureManager {
  getDataTranslator(manifest: IWrapManifest): IDataTranslator {
    switch (manifest.version) {
      default:
        return new MsgpackDataTranslator();
    }
  }

  getDtReceiver(manifest: IWrapManifest): IDtReceiver {
    switch (manifest.version) {
      default:
        return new DtReceiver();
    }
  }
}

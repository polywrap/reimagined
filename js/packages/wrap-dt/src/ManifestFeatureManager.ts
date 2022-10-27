import { IWrapManifest } from "@polywrap/reim-wrap";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { IDataTranslator } from "./IDataTranslator";
import { IDtReceiver } from "./IDtReceiver";
import { IManifestFeatureManager } from "./IManifestFeatureManager";
import { HostFunctionV_0_2 } from "./host-functions/HostFunctionV_0_2";
import { bufferToU32 } from "./WasmWrapper";

export class MsgpackDataTranslator implements IDataTranslator {
  encode<T>(data: T): Uint8Array {
    return msgpackEncode(data);
  }

  decode<T>(buffer: Uint8Array): T {
    return msgpackDecode(buffer) as T;
  }
}

export class JsonDataTranslator implements IDataTranslator {
  encode<T>(data: T): Uint8Array {
    return new TextEncoder().encode(JSON.stringify(data));
  }

  decode<T>(buffer: Uint8Array): T {
    return JSON.parse(new TextDecoder().decode(buffer)) as T;
  }
}

export class DtReceiver implements IDtReceiver {
  async onReceive(buffer: Uint8Array): Promise<Uint8Array> {
    const func: HostFunctionV_0_2 = bufferToU32(buffer);
    const dataBuffer = buffer.slice(4, buffer.length);

    switch (func) {
      case HostFunctionV_0_2.Log:
        console.log(
          "onReceive",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );

        return new Uint8Array();
    }

    return new Uint8Array();
  }
}

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

import { IDtReceiver } from "./IDtReceiver";
import { HostResourceV_0_2 } from "./host-resources/HostResourceV_0_2";
import { bufferToU32 } from "./WasmWrapper";


export class DtReceiver implements IDtReceiver {
  async onReceive(buffer: Uint8Array): Promise<Uint8Array> {
    const func: HostResourceV_0_2 = bufferToU32(buffer);
    const dataBuffer = buffer.slice(4, buffer.length);

    switch (func) {
      case HostResourceV_0_2.Log:
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

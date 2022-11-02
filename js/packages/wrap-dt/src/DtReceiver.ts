import { IDtReceiver } from "./IDtReceiver";
import { HostResourceV_0_3 } from "./host-resources/HostResourceV_0_3";
import { bufferToU32 } from "./WasmWrapper";
import { IWrapper, IHost } from "@polywrap/reim-wrap";


export class DtReceiver implements IDtReceiver {
  async onReceive(buffer: Uint8Array, host: IHost | undefined, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> {
    const func: HostResourceV_0_3 = bufferToU32(buffer);
    const dataBuffer = buffer.slice(4, buffer.length);

    switch (func) {
      case HostResourceV_0_3.Log:
        console.log(
          "Host: Log",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );

      return new Uint8Array();
      case HostResourceV_0_3.InvokeGlobalFunction:
        console.log(
          "Host: InvokeGlobalFunction",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );

        return new Uint8Array();
      case HostResourceV_0_3.InvokeClassMethod:
        console.log(
          "Host: InvokeClassMethod",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );

        if (host) {
          return host.invokeClassMethod(dataBuffer, trackedReferenceMap);
        } else {
          throw new Error("Host is not defined");
        }

        return new Uint8Array();
    }

    return new Uint8Array();
  }
}

import { IDtReceiver } from "./IDtReceiver";
import { HostResourceV_0_3 } from "./host-resources/HostResourceV_0_3";
import { bufferToU32 } from "./WasmWrapper";
import { IWrapInstance } from "@polywrap/reim-wrap";


export class DtReceiver implements IDtReceiver {
  async onReceive(buffer: Uint8Array, internalInstance: IWrapInstance | undefined, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> {
    const resource: number = bufferToU32(buffer);
    const dataBuffer = buffer.slice(4, buffer.length);

    switch (resource) {
      case HostResourceV_0_3.Log:
        console.log(
          "Host: Log",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );

      return new Uint8Array();
      case HostResourceV_0_3.LogBytes:
        console.log(dataBuffer);
        return new Uint8Array();
      case HostResourceV_0_3.InvokeGlobalFunction:
        console.log(
          "Host: InvokeGlobalFunction",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );
        console.log(
          "aaaaaaaaaaaaa",
        );

        if (internalInstance) {
          return internalInstance.invokeResource(HostResourceV_0_3.InvokeGlobalFunction, dataBuffer);
        } else {
          throw new Error("Internal instance is not defined");
        }
      case HostResourceV_0_3.InvokeClassMethod:
        console.log(
          "Host: InvokeClassMethod",
          dataBuffer,
          new TextDecoder().decode(dataBuffer)
        );

        if (internalInstance) {
          return internalInstance.invokeResource(HostResourceV_0_3.InvokeClassMethod, dataBuffer);
        } else {
          throw new Error("Host is not defined");
        }
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  }
}

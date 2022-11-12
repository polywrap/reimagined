import { IDtInstance } from "@polywrap/reim-dt";
import { u32 } from "@polywrap/reim-dt-wasm";
import { IWrapInstance } from "@polywrap/reim-wrap";
import { bufferToU32, concat, u32ToBuffer } from "@polywrap/reim-wrap-dt";
import { InternalWrapInstance } from "./InternalWrapInstance";

export class ExternalWrapInstance implements IWrapInstance {
  constructor(private readonly dtInstance: IDtInstance) {
  }

  invokeResource(resource: u32, buffer: Uint8Array): Promise<Uint8Array> {
    return this.dtInstance.send(
      concat([u32ToBuffer(resource), buffer]),
      (buffer) => {
        const resource: number = bufferToU32(buffer);
        const dataBuffer = buffer.slice(4, buffer.length);

        return new InternalWrapInstance().invokeResource(resource, dataBuffer);
      }
    );
  }
}

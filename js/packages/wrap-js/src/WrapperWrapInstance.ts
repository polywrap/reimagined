import { IDtInstance } from "@polywrap/reim-dt";
import { concat, u32ToBuffer, bufferToU32 } from "./buffer";
import { IExternalWrapInstance } from "./IExternalWrapInstance";
import { IInternalWrapInstance } from "./IInternalWrapInstance";

export class WrapperWrapInstance implements IExternalWrapInstance {
  constructor(private readonly dtInstance: IDtInstance, private readonly internalInstance: IInternalWrapInstance) {
  }

  invokeResource(resource: number, buffer: Uint8Array): Promise<Uint8Array> {
    return this.dtInstance.send(
      concat([u32ToBuffer(resource), buffer]),
      (buffer: Uint8Array) => {
        const resource = bufferToU32(buffer);
        const dataBuffer = buffer.slice(4, buffer.length);

        return this.internalInstance.invokeResource(resource, dataBuffer, this);
      }
    );
  }
}

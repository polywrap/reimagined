import { concat, u32ToBuffer, IExternalWrapInstance, IInternalWrapInstance } from "@nerfzael/reim-wrap-as";

export class WrapperWrapInstance implements IExternalInstance {
  constructor(private readonly dtInstance: IDtInstance, private readonly internalInstance: IInternalWrapInstance) {
  }

  invokeResource(resource: number, buffer: Uint8Array): Promise<Uint8Array> {
    return this.dtInstance.send(
      concat([u32ToBuffer(resource), buffer]),
      (buffer) => {
        const resource: number = bufferToU32(buffer);
        const dataBuffer = buffer.slice(4, buffer.length);

        return this.internalInstance.invokeResource(resource, dataBuffer);
      }
    );
  }
}

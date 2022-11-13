import { IExternalWrapInstance } from "./IExternalWrapInstance";

export interface IInternalWrapInstance {
  invokeResource(resource: number, buffer: Uint8Array, externalInstance: IExternalWrapInstance): Promise<Uint8Array>;
}

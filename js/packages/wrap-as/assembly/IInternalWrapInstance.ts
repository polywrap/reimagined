import { IExternalWrapInstance } from "./IExternalWrapInstance";

export abstract class IInternalWrapInstance {
  abstract invokeResource(resource: u32, buffer: ArrayBuffer, externalInstance: IExternalWrapInstance): ArrayBuffer;
}

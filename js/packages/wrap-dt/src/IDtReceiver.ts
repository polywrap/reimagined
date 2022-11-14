import { IWrapInstance } from "@polywrap/reim-wrap";

export interface IDtReceiver {
  onReceive(buffer: Uint8Array, internalInstance: IWrapInstance | undefined, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array>;
}

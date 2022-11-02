import { IHost } from "@polywrap/reim-wrap";

export interface IDtReceiver {
  onReceive(buffer: Uint8Array, host: IHost | undefined, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array>;
}

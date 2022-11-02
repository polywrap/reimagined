export interface IHost {
  invokeClassMethod(buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array>;
}

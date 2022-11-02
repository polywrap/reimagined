export interface IHost {
  invokeGlobalFunction(buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array>;
  invokeClassMethod(buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array>;
}

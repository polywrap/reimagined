export interface IWrapInstance {
  invokeResource(resource: number, buffer: Uint8Array): Promise<Uint8Array>;
}

export interface IDtInstance {
  send(buffer: Uint8Array, onReceive: (buffer: Uint8Array) => Promise<Uint8Array>): Promise<Uint8Array>;
}

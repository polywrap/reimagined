export interface IDtReceiver {
  onReceive(buffer: Uint8Array): Promise<Uint8Array>;
}

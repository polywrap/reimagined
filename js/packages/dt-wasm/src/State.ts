export interface State {
  inputBuffer: Uint8Array;
  onReceive: (buffer: Uint8Array) => Promise<Uint8Array>;
  sendResult: Uint8Array;
}

import { writeBytes, readBytes } from "./buffer";
import { State } from "./State";
import { u32 } from "./wasm-types";

export class DtImports {
  constructor(
    private readonly memory: WebAssembly.Memory,
    private readonly state: State,
  ) { }

  wrap = {
    __dt_fill_input_buffer: async (bufferPtr: u32): Promise<void> => {
      writeBytes(this.state.inputBuffer, this.memory.buffer, bufferPtr);
    },
    __dt_send: async (bufferPtr: u32, bufferLen: u32): Promise<u32> => {
      const buffer = readBytes(this.memory.buffer, bufferPtr, bufferLen);

      this.state.sendResult = await this.state.onReceive(new Uint8Array(buffer));

      return this.state.sendResult.byteLength;
    },
    __dt_fill_send_result: async (bufferPtr: u32): Promise<void> => {
      writeBytes(this.state.sendResult, this.memory.buffer, bufferPtr);
    },
  };

  env = {
    memory: this.memory,
  };
}

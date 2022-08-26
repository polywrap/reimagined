/* eslint-disable @typescript-eslint/naming-convention */

import { u32 } from "./types";
import { WrapImports } from "./WrapImports";
import { readBytes, readString, writeBytes, writeString } from "./buffer";

import { State } from "./State";

export const createImports = (config: {
  memory: WebAssembly.Memory;
  state: State;
  abort: (message: string) => never;
}): WrapImports => {
  const { memory, state, abort } = config;

  return {
    wrap: {
      __wrap_invoke_host: async (buffer_ptr: u32, buffer_len: u32, result_buffer_len_ptr: u32): Promise<boolean> => {
        return false;
      },
      __wrap_return_invoke_wasm_result: async (buffer_ptr: u32, buffer_len: u32): Promise<void> => {
        state.invoke.result = new Uint8Array(
          readBytes(memory.buffer, buffer_ptr, buffer_len)
        );
      },
      __wrap_fill_input_buffer: async (buffer_ptr: u32): Promise<void> => {
          writeBytes(state.inputBuffer, memory.buffer, buffer_ptr);
      },
      __wrap_fill_invoke_host_result: async (buffer_ptr: u32): Promise<void> => {
      },
      __wrap_abort: (
        msgPtr: u32,
        msgLen: u32,
        filePtr: u32,
        fileLen: u32,
        line: u32,
        column: u32
      ): void => {
        const msg = readString(memory.buffer, msgPtr, msgLen);
        const file = readString(memory.buffer, filePtr, fileLen);

        abort(
          `__wrap_abort: ${msg}\nFile: ${file}\nLocation: [${line},${column}]`
        );
      },
      __wrap_debug_log: async (ptr: u32, len: u32): Promise<void> => {
        const msg = readString(memory.buffer, ptr, len);
        console.debug(`__wrap_debug_log: ${msg}`);
      },
    },
    env: {
      memory,
    },
  };
};

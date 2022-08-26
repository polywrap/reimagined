import { u32 } from "./types";

export interface WrapImports extends WebAssembly.Imports {
  wrap: {
    __wrap_invoke_host(buffer_ptr: u32, buffer_len: u32, result_buffer_len_ptr: u32): Promise<boolean>;
    __wrap_return_invoke_wasm_result(buffer_ptr: u32, buffer_len: u32): Promise<void>;
    __wrap_fill_input_buffer(buffer_ptr: u32): Promise<void>;
    __wrap_fill_invoke_host_result(buffer_ptr: u32): Promise<void>;
    __wrap_abort: (
      msgPtr: u32,
      msgLen: u32,
      filePtr: u32,
      fileLen: u32,
      line: u32,
      column: u32
    ) => void;
    __wrap_debug_log: (ptr: u32, len: u32) => Promise<void>;
  };
  env: {
    memory: WebAssembly.Memory;
  };
}

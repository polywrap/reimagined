import { u32 } from "./types";

export interface WrapExports extends WebAssembly.Exports {
  _wrap_invoke_wasm: (bufferLen: u32) => boolean;
}

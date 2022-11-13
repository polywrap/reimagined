import { u32 } from "./wasm-types";

export interface DtExports extends WebAssembly.Exports {
  _dt_receive: (bufferLen: u32) => Promise<u32>;
}

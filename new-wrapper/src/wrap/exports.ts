
import { __wrap_fill_input_buffer } from "./imports";
import { wrap_invoke_wasm } from "./main";

export function _wrap_invoke_wasm(inputBufferLen: u64): bool {
  const inputBuffer = new ArrayBuffer(inputBufferLen);

  __wrap_fill_input_buffer(
    changetype<u64>(inputBuffer),
  );

  return wrap_invoke_wasm(inputBuffer);
}

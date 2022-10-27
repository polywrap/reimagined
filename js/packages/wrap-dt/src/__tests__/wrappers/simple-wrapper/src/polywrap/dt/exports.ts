
import { HostFunction } from "../wrap/host-functions/HostFunction";
import { invoke_host_function } from "../wrap/host-functions/invoke_host_function";
import { wrap_log } from "../wrap/host-functions/wrap_log";
import { __dt_fill_input_buffer } from "./imports";
import { receive } from "./main";

export function _dt_receive(inputBufferLen: u32): u32 {
  const inputBuffer = new ArrayBuffer(inputBufferLen as i32);

  __dt_fill_input_buffer(
    changetype<u32>(inputBuffer),
  );

  wrap_log("Received input buffer");

  return receive(inputBuffer);
}

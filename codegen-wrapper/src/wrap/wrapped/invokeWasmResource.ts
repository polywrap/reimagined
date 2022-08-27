import { wrap_debug_log } from "@polywrap/wasm-as";
import { return_result_to_host } from "../main";
import { simpleMethodWrapped } from "./simpleMethod";
import { anotherMethodWrapped } from "./anotherMethod";

export function invokeWasmResource(resourceId: u32, dataBuffer: ArrayBuffer): bool {
  switch(resourceId) {
    case 0: 
        return return_result_to_host(simpleMethodWrapped(dataBuffer));
    case 1: 
        return return_result_to_host(anotherMethodWrapped(dataBuffer));
    default: 
      return false;
  }
}

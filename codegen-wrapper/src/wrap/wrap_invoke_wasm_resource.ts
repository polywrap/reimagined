import { wrap_debug_log } from "@polywrap/wasm-as";
import { return_result_to_host } from "./main";
import { simpleMethodWrapped } from "./wrapped/simpleMethod";

export function wrap_invoke_wasm_resource(resourceId: u32, dataBuffer: ArrayBuffer): bool {
  switch(resourceId) {
    case 0: 
      wrap_debug_log("found 0");
      return return_result_to_host(simpleMethodWrapped(dataBuffer));
    default: 
      wrap_debug_log("not found");
      return false;
  }
}

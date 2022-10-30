import { stringify, parse } from '@serial-as/json'
import { Args } from "./args";

export function serializeType(type: Args): ArrayBuffer {
  return String.UTF8.encode(stringify<Args>(type));
}

export function deserializeType(buffer: ArrayBuffer): Args {
  return parse<Args>(String.UTF8.decode(buffer));
}

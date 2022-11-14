import { stringify, parse } from "@serial-as/json";

export class BaseTypeSerialization {
  static serialize<T>(value: T): ArrayBuffer {
    return String.UTF8.encode(stringify<T>(value));
  }

  static deserialize<T>(buffer: ArrayBuffer): T {
    return parse<T>(String.UTF8.decode(buffer));
  }
}

export class BaseTypeSerialization {
  static serialize<T>(value: T): Uint8Array {
    return new TextEncoder().encode(JSON.stringify(value));
  }

  static deserialize<T>(buffer: Uint8Array): T {
    return JSON.parse(new TextDecoder().decode(buffer));
  }
}

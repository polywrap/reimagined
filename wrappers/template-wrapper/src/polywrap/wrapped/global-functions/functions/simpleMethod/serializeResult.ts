import { Context, Write, WriteEncoder, WriteSizer } from "@polywrap/wasm-as";

export function serializeResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: simpleMethod");
  const sizer = new WriteSizer(sizerContext);
  writeResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: simpleMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeResult(encoder, result);
  return buffer;
}

export function writeResult(writer: Write, result: string): void {
  writer.context().push("simpleMethod", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

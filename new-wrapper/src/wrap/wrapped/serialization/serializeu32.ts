import { Context, Write, WriteEncoder, WriteSizer } from "@polywrap/wasm-as";

export function serializeu32(result: u32): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) module-type: u32Method");
    const sizer = new WriteSizer(sizerContext);
    writeu32MethodResult(sizer, result);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) module-type: u32Method");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    writeu32MethodResult(encoder, result);
    return buffer;
}

function writeu32MethodResult(writer: Write, result: u32): void {
    writer.context().push("u32Method", "u32", "writing property");
    writer.writeUInt32(result);
    writer.context().pop();
  }
  
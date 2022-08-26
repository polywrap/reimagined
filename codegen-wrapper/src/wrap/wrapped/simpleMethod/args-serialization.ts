import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import { Args } from "./args";

export function serializeType(type: Args): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Args");
  const sizer = new WriteSizer(sizerContext);
  writeType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Args");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeType(encoder, type);
  return buffer;
}

export function writeType(writer: Write, type: Args): void {
    
  writer.context().push("arg", "string", "writing property");
  writer.writeString("arg");
  writer.context().pop();
}

export function deserializeType(buffer: ArrayBuffer): Args {
  const context: Context = new Context("Deserializing object-type simpleMethod");
  const reader = new ReadDecoder(buffer, context);
  return readType(reader);
}

export function readType(reader: Read): Args {
  let numFields = reader.readMapLength();

  
  let _arg: string = "";
    

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "string", "type found, reading property");
            reader.context().pop();
    }
    reader.context().pop();
  }

    

  return {
    arg: _arg
  };
}

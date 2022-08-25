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

export class EthereumSignerWrapped {
  __classInstancePtr: u32;

  static toBuffer(type: EthereumSignerWrapped): ArrayBuffer {
    return serializeEthereumSignerWrapped(type);
  }

  static fromBuffer(buffer: ArrayBuffer): EthereumSignerWrapped {
    return deserializeEthereumSignerWrapped(buffer);
  }

  static write(writer: Write, type: EthereumSignerWrapped): void {
    writeEthereumSignerWrapped(writer, type);
  }

  static read(reader: Read): EthereumSignerWrapped {
    return readEthereumSignerWrapped(reader);
  }
}

export function serializeEthereumSignerWrapped(type: EthereumSignerWrapped): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: EthereumSignerWrapped");
  const sizer = new WriteSizer(sizerContext);
  writeEthereumSignerWrapped(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: EthereumSignerWrapped");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereumSignerWrapped(encoder, type);
  return buffer;
}

export function writeEthereumSignerWrapped(writer: Write, type: EthereumSignerWrapped): void {
  writer.writeMapLength(1);
  writer.context().push("__classInstancePtr", "u32", "writing property");
  writer.writeString("__classInstancePtr");
  writer.writeUInt32(type.__classInstancePtr);
  writer.context().pop();
}

export function deserializeEthereumSignerWrapped(buffer: ArrayBuffer): EthereumSignerWrapped {
  const context: Context = new Context("Deserializing object-type EthereumSignerWrapped");
  const reader = new ReadDecoder(buffer, context);
  return readEthereumSignerWrapped(reader);
}

export function readEthereumSignerWrapped(reader: Read): EthereumSignerWrapped {
  let numFields = reader.readMapLength();

  let ___classInstancePtr: u32 = 0;
  let ___classInstancePtrSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "__classInstancePtr") {
      reader.context().push(field, "u32", "type found, reading property");
      ___classInstancePtr = reader.readUInt32();
      ___classInstancePtrSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!___classInstancePtrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: '__classInstancePtr: UInt32'"));
  }

  return {
    __classInstancePtr: ___classInstancePtr
  };
}

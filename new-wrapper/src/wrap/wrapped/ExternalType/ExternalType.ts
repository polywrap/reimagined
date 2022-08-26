import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Context,
  wrap_debug_log
} from "@polywrap/wasm-as";
import { wrap_invoke_host_resource } from "../../main";
import { deserializeString } from "../serialization/deserializeString";
import { serializeString } from "../serialization/serializeString";

const externalResourceId = 0;

export class ExternalType {
  constructor(arg: string) {
    const buffer = serializeString(arg);
    const resultBuffer = wrap_invoke_host_resource(externalResourceId, buffer);
    const obj = ExternalType.fromBuffer(resultBuffer);

    this.__classInstancePtr = obj.__classInstancePtr;
  }
  __classInstancePtr: u64;

  _count: u32;
  get count(): u32 {
      return this._count;
  }

  set count(value: u32) {
    this._count = value;
  }

  instanceMethod(arg: string): string {
    wrap_debug_log("sub instanceMethod");
    
    const buffer = serializeString(arg);
    const resultBuffer = wrap_invoke_host_resource(externalResourceId, buffer);

    wrap_debug_log("sub __wrap_invoke_instance");
  
    return deserializeString(resultBuffer);
  }

  static toBuffer(type: ExternalType): ArrayBuffer {
    return serializeType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ExternalType {
    return deserializeType(buffer);
  }

  static write(writer: Write, type: ExternalType): void {
    writeType(writer, type);
  }

  static read(reader: Read): ExternalType {
    return readType(reader);
  }
}

function serializeType(type: ExternalType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: ICalcWrapped");
  const sizer = new WriteSizer(sizerContext);
  writeType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: ICalcWrapped");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeType(encoder, type);
  return buffer;
}

export function writeType(writer: Write, type: ExternalType): void {
  writer.writeMapLength(3);
  writer.context().push("__wrapInstancePtr", "u32", "writing property");
  writer.writeString("__wrapInstancePtr");
  writer.writeUInt32(type.__wrapInstancePtr);
  writer.context().pop();
  writer.context().push("__classInstancePtr", "u32", "writing property");
  writer.writeString("__classInstancePtr");
  writer.writeUInt32(type.__classInstancePtr);
  writer.context().pop();
  writer.context().push("count", "u32", "writing property");
  writer.writeString("count");
  writer.writeUInt32(type.count);
  writer.context().pop();
}

export function deserializeType(buffer: ArrayBuffer): ExternalType {
  const context: Context = new Context("Deserializing object-type IICalcWrapped");
  const reader = new ReadDecoder(buffer, context);
  return readType(reader);
}

export function readType(reader: Read): ExternalType {
  let numFields = reader.readMapLength();

  let ___wrapInstancePtr: u32 = 0;
  let ___wrapInstancePtrSet: bool = false;
  let ___classInstancePtr: u32 = 0;
  let ___classInstancePtrSet: bool = false;
  let _count: u32 = 0;
  let _countSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "__wrapInstancePtr") {
      reader.context().push(field, "u32", "type found, reading property");
      ___wrapInstancePtr = reader.readUInt32();
      ___wrapInstancePtrSet = true;
      reader.context().pop();
    }
    else if (field == "__classInstancePtr") {
      reader.context().push(field, "u32", "type found, reading property");
      ___classInstancePtr = reader.readUInt32();
      ___classInstancePtrSet = true;
      reader.context().pop();
    }
    else if (field == "count") {
      reader.context().push(field, "u32", "type found, reading property");
      _count = reader.readUInt32();
      _countSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!___wrapInstancePtrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: '__wrapInstancePtr: UInt32'"));
  }
  if (!___classInstancePtrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: '__classInstancePtr: UInt32'"));
  }
  if (!_countSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'count: UInt32'"));
  }

  return new ICalcWrapped(___wrapInstancePtr, ___classInstancePtr, _count);
}

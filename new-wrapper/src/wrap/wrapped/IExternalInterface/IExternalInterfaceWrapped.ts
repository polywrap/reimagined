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
  Context,
  Result,
  wrap_debug_log
} from "@polywrap/wasm-as";
import { wrap_invoke_host_resource } from "../../main";
import { deserializeString } from "../serialization/deserializeString";
import { serializeString } from "../serialization/serializeString";
import { IExternalInterface } from "./IExternalInterface";

const externalResourceId = 1;

export class IExternalInterfaceWrapped implements IExternalInterface {
  constructor(
    public __classInstancePtr: u32, 
    count: u32
  ) {
    this._count = count;
  }

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

  static toBuffer(type: IExternalInterfaceWrapped): ArrayBuffer {
    return serializeType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): IExternalInterfaceWrapped {
    return deserializeType(buffer);
  }

  static write(writer: Write, type: IExternalInterfaceWrapped): void {
    writeType(writer, type);
  }

  static read(reader: Read): IExternalInterfaceWrapped {
    return readType(reader);
  }
}

function serializeType(type: IExternalInterfaceWrapped): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: IExternalInterfaceWrapped");
  const sizer = new WriteSizer(sizerContext);
  writeType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: IExternalInterfaceWrapped");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeType(encoder, type);
  return buffer;
}

export function writeType(writer: Write, type: IExternalInterfaceWrapped): void {
  writer.writeMapLength(2);
  writer.context().push("__classInstancePtr", "u32", "writing property");
  writer.writeString("__classInstancePtr");
  writer.writeUInt32(type.__classInstancePtr);
  writer.context().pop();
  writer.context().push("count", "u32", "writing property");
  writer.writeString("count");
  writer.writeUInt32(type.count);
  writer.context().pop();
}

export function deserializeType(buffer: ArrayBuffer): IExternalInterfaceWrapped {
  const context: Context = new Context("Deserializing object-type IExternalInterface");
  const reader = new ReadDecoder(buffer, context);
  return readType(reader);
}

export function readType(reader: Read): IExternalInterfaceWrapped {
  let numFields = reader.readMapLength();

  let ___classInstancePtr: u32 = 0;
  let ___classInstancePtrSet: bool = false;
  let _count: u32 = 0;
  let _countSet: bool = false;

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
    else if (field == "count") {
      reader.context().push(field, "u32", "type found, reading property");
      _count = reader.readUInt32();
      _countSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!___classInstancePtrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: '__classInstancePtr: UInt32'"));
  }
  if (!_countSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'count: UInt32'"));
  }

  return new IExternalInterfaceWrapped(
    ___classInstancePtr, 
    _count
  );
}

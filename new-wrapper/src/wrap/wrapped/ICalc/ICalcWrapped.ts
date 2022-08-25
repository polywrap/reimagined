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
import { ICalc } from "./ICalc";

export class ICalcWrapped implements ICalc {
  constructor(public __wrapInstancePtr: u32, public __classInstancePtr: u32, count: u32) {
    this._count = count;
  }

  _count: u32;
  get count(): u32 {
      return this._count;
  }

  set count(value: u32) {
    this._count = value;
  }

  increment(): string {
    const methodBuf = String.UTF8.encode("increment");
    wrap_debug_log("sub increment");
    
    const success = wrap_invoke_host(
      this.__wrapInstancePtr, 
      this.__classInstancePtr,
      changetype<u32>(methodBuf), methodBuf.byteLength,
      0, 0
    );
    wrap_debug_log("sub __wrap_invoke_instance");
  
    if (!success) {
      wrap_debug_log("Failed to invoke method: increment");
      throw new Error("Failed to invoke method: increment");
    }
    wrap_debug_log("sub success");
  
    const resultLen = __wrap_invoke_instance_result_len();
    wrap_debug_log("sub __wrap_invoke_instance_result_len");
    const resultBuffer = new ArrayBuffer(resultLen);
    __wrap_invoke_instance_result(changetype<u32>(resultBuffer));
    wrap_debug_log("sub __wrap_invoke_instance_result");
  
    return deserializeString(resultBuffer);
  }

  static toBuffer(type: ICalcWrapped): ArrayBuffer {
    return serializeType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ICalcWrapped {
    return deserializeType(buffer);
  }

  static write(writer: Write, type: ICalcWrapped): void {
    writeType(writer, type);
  }

  static read(reader: Read): ICalcWrapped {
    return readType(reader);
  }
}

function serializeType(type: ICalcWrapped): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: ICalcWrapped");
  const sizer = new WriteSizer(sizerContext);
  writeType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: ICalcWrapped");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeType(encoder, type);
  return buffer;
}

export function writeType(writer: Write, type: ICalcWrapped): void {
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

export function deserializeType(buffer: ArrayBuffer): ICalcWrapped {
  const context: Context = new Context("Deserializing object-type IICalcWrapped");
  const reader = new ReadDecoder(buffer, context);
  return readType(reader);
}

export function readType(reader: Read): ICalcWrapped {
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

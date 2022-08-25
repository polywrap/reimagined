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
import { deserializeString } from "./deserializeString";
import { ICalc } from "./ICalc";
import { __wrap_invoke_instance, __wrap_invoke_instance_result, __wrap_invoke_instance_result_len } from "./imports";

export class CalcWrapped implements ICalc {
  constructor(private __wrapInstancePtr: u32, private __classInstancePtr: u32, count: u32) {
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
    
    const success = __wrap_invoke_instance(
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

  static toBuffer(type: CalcWrapped): ArrayBuffer {
    return serializeCalcWrapped(type);
  }

  static fromBuffer(buffer: ArrayBuffer): CalcWrapped {
    return deserializeCalcWrapped(buffer);
  }

  static write(writer: Write, type: CalcWrapped): void {
    writeCalcWrapped(writer, type);
  }

  static read(reader: Read): CalcWrapped {
    return readCalcWrapped(reader);
  }
}

export function serializeCalcWrapped(type: CalcWrapped): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: CalcWrapped");
  const sizer = new WriteSizer(sizerContext);
  writeCalcWrapped(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: CalcWrapped");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeCalcWrapped(encoder, type);
  return buffer;
}

export function writeCalcWrapped(writer: Write, type: CalcWrapped): void {
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

export function deserializeCalcWrapped(buffer: ArrayBuffer): CalcWrapped {
  const context: Context = new Context("Deserializing object-type CalcWrapped");
  const reader = new ReadDecoder(buffer, context);
  return readCalcWrapped(reader);
}

export function readCalcWrapped(reader: Read): CalcWrapped {
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

  return new CalcWrapped(___wrapInstancePtr, ___classInstancePtr, _count);
}

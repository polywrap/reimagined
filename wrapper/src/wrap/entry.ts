import {
  wrap_invoke,
  wrap_abort,
  __wrap_invoke_args,
  InvokeArgs,
  __wrap_invoke_result,
  Context,
  WriteEncoder,
  WriteSizer,
  Write,
  __wrap_invoke_error,
  wrap_debug_log,
} from "@polywrap/wasm-as";
import { EthereumProvider, EthereumSigner } from "..";
import { CalcWrapped, deserializeCalcWrapped } from "./CalcWrapped";
import { EthereumSignerWrapped } from "./EthereumSignerWrapped";
import { __wrap_instantiate_args, __wrap_invoke_instance_args } from "./imports";
import { deserializesimpleMethodArgs, serializesimpleMethodResult } from "./Module/serialization";

import {
  simpleMethodWrapped
} from "./Module/wrapped";

export type InvokeInstanceFunction = (instance_ptr: u32, argsBuf: ArrayBuffer) => ArrayBuffer;

export function _wrap_instantiate(class_name_size: u32, args_size: u32): bool {
  const classNameBuf = new ArrayBuffer(class_name_size);
  const argsBuf = new ArrayBuffer(args_size);
  __wrap_instantiate_args(
    changetype<u32>(classNameBuf),
    changetype<u32>(argsBuf)
  );
  // const className = String.UTF8.decode(classNameBuf);
  const className = String.UTF8.decode(classNameBuf);

  if (className == "EthereumProvider") {
    const result = instantiateEthereumProvider(argsBuf);
    __wrap_invoke_result(
      changetype<u32>(result),
      result.byteLength
    );
    return true;
  }

  return false;
}

function instantiateEthereumProvider(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesimpleMethodArgs(argsBuf);

  const instance = new EthereumProvider(args.arg);
  const result = changetype<u32>(instance);
  return serializeClassInstancePtr(result);
}

export function serializeClassInstancePtr(classInstancePtr: u32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: u32Method");
  const sizer = new WriteSizer(sizerContext);
  writeu32MethodResult(sizer, classInstancePtr);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: u32Method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeu32MethodResult(encoder, classInstancePtr);
  return buffer;
}

export function writeu32MethodResult(writer: Write, result: u32): void {
  writer.context().push("u32Method", "u32", "writing property");
  writer.writeUInt32(result);
  writer.context().pop();
}

export function _wrap_invoke_instance(class_name_size: u32, instance_ptr: u32, method_name_size: u32, args_size: u32): bool {
  const classNameBuf = new ArrayBuffer(class_name_size);
  const methodNameBuf = new ArrayBuffer(method_name_size);
  const argsBuf = new ArrayBuffer(args_size);
  __wrap_invoke_instance_args(
    changetype<u32>(classNameBuf),
    changetype<u32>(methodNameBuf),
    changetype<u32>(argsBuf)
  );
  const className = String.UTF8.decode(classNameBuf);
  const methodName = String.UTF8.decode(methodNameBuf);

  if (className == "EthereumProvider") {
    if (methodName == "instanceMethod") {
      return wrap_invoke_instance(instance_ptr, new InvokeArgs(methodName, argsBuf), instanceMethodWrapped);
    } else if (methodName == "getSigner") {
      return wrap_invoke_instance(instance_ptr, new InvokeArgs(methodName, argsBuf), getSignerWrapped);
    } else if (methodName == "increment") {
      return wrap_invoke_instance(instance_ptr, new InvokeArgs(methodName, argsBuf), incrementWrapped);
    }
  } else if (className == "EthereumSigner") {
    if (methodName == "getAddress") {
      return wrap_invoke_instance(instance_ptr, new InvokeArgs(methodName, argsBuf), getAddressWrapped);
    }
  }

  return false;
}

export function wrap_invoke_instance(instance_ptr: u32, args: InvokeArgs, fn: InvokeInstanceFunction | null): bool {
  if (fn) {
    const result = fn(instance_ptr, args.args);
    __wrap_invoke_result(
      changetype<u32>(result),
      result.byteLength
    );
    return true;
  } else {
    const message = String.UTF8.encode(
      `Could not find invoke function "${args.method}"`
    );
    __wrap_invoke_error(
      changetype<u32>(message),
      message.byteLength
    );
    return false;
  }
}

export function instanceMethodWrapped(instance_ptr: u32, argsBuf: ArrayBuffer): ArrayBuffer {
  const instance: EthereumProvider = changetype<EthereumProvider>(instance_ptr);
  
  const args = deserializesimpleMethodArgs(argsBuf);

  const result = instance.instanceMethod(
    {
      arg: args.arg
    }
  );
  return serializesimpleMethodResult(result);
}

export function getSignerWrapped(instance_ptr: u32, argsBuf: ArrayBuffer): ArrayBuffer {
  const instance: EthereumProvider = changetype<EthereumProvider>(instance_ptr);
  
  const result = instance.getSigner();

  // Get ptr since this is a class instance (reference type)
  const ptr = changetype<u32>(result);
  return EthereumSignerWrapped.toBuffer({
    __classInstancePtr: ptr
  });
}

export function getAddressWrapped(instance_ptr: u32, argsBuf: ArrayBuffer): ArrayBuffer {
  const instance: EthereumSigner = changetype<EthereumSigner>(instance_ptr);
  
  const result = instance.getAddress();

  return serializesimpleMethodResult(result)
}

export function incrementWrapped(instance_ptr: u32, argsBuf: ArrayBuffer): ArrayBuffer {
  const instance: EthereumProvider = changetype<EthereumProvider>(instance_ptr);
  
  const args = deserializeCalcWrapped(argsBuf);
  wrap_debug_log("incrementWrapped deserializeCalcWrapped" + args.count.toString());
  
  const result = instance.increment(
    args
  );
  wrap_debug_log("incrementWrapped result");
  return serializesimpleMethodResult(result);
}

export function _wrap_invoke(class_name_size: u32, method_name_size: u32, args_size: u32): bool {
  const args: StaticInvokeArgs = wrap_invoke_args(
    class_name_size,
    method_name_size,
    args_size
  );

  if (args.className == "Module") {
    if (args.methodName == "simpleMethod") {
      return wrap_invoke(new InvokeArgs(args.methodName, args.args), 0, simpleMethodWrapped);
    }
  }

  return false;
}

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  wrap_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}

// Helper for fetching invoke args (Frpm wasm-as)
export function wrap_invoke_args(class_name_size: u32, method_size: u32, args_size: u32): StaticInvokeArgs {
  // const classNameBuf = new ArrayBuffer(class_name_size);
  const methodNameBuf = new ArrayBuffer(method_size);
  const argsBuf = new ArrayBuffer(args_size);
  __wrap_invoke_args(
    changetype<u32>(methodNameBuf),
    changetype<u32>(argsBuf)
  );
  // const className = String.UTF8.decode(classNameBuf);
  const method = String.UTF8.decode(methodNameBuf);

  return new StaticInvokeArgs(
    "Module",
    method,
    argsBuf
  );
}

export class StaticInvokeArgs {
  constructor(
    public className: string,
    public methodName: string,
    public args: ArrayBuffer
  ) { }
}

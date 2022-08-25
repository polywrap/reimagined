import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { ResultErr, ResultOk, Result } from "@polywrap/result";
import { WrapExports } from "./types";
import { State } from "./State";
import { createImports } from "./imports";
import { IWrapInstance } from "@polywrap/reim-wrap";

export class WasmInstance implements IWrapInstance {
  public static requiredExports: readonly string[] = ["_wrap_invoke"];

  private classInstanceCount: number = 0;

  constructor(private readonly state: State, private readonly wasmInstance: AsyncWasmInstance) {
    state.wasmInstance = this;
  }

  static async create<TEnv>(wasmModule: Uint8Array, env: TEnv): Promise<IWrapInstance> {
    const state: State = {
      wrapInstances: new Map(),
      classInstances: new Map(),
      invoke: {},
      subinvoke: {
        args: [],
      },
      invokeInstance: {
        args: [],
      },
      subinvokeImplementation: {
        args: [],
      },
      invokeResult: {} as Result<unknown, unknown>,
      className: "",
      classInstancePtr: 0,
      methodName: "",
      args: new Uint8Array(),
      env: msgpackEncode(env),
    };

    const abort = (message: string) => {
      throw "WasmWrapper: Wasm module aborted execution.";
    };

    const memory = AsyncWasmInstance.createMemory({ module: wasmModule });
    const instance: AsyncWasmInstance = await AsyncWasmInstance.createInstance({
      module: wasmModule,
      imports: createImports({
        state,
        memory,
        abort,
      }),
      requiredExports: WasmInstance.requiredExports,
    });

    return new WasmInstance(state, instance);
  }

  async instantiate<TArgs>(className: string, args: TArgs): Promise<Result<number, string>> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const exports = this.wasmInstance.exports as WrapExports;

    this.state.className = className;
    this.state.args = argsBuffer;

    console.log({
      className,
      argsBuffer
    });

    console.log({
      className: this.state.className,
      args: this.state.args
    });

    const result = await exports._wrap_instantiate(
      this.state.className.length,
      this.state.args.byteLength,
    );

    if (result) {
      const resultBuffer = this.state.invoke.result;
      if (!resultBuffer) {
        return ResultErr("instantiate Response is undefined");
      }

      return ResultOk(msgpackDecode(resultBuffer) as number);
    } else {
      return ResultErr(this.state.invoke.error);
    }
  }

  async invokeInstance<TArgs, TData>(className: string, classInstancePtr: number, methodName: string, args: TArgs): Promise<Result<TData, string>> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const exports = this.wasmInstance.exports as WrapExports;

    this.state.className = className;
    this.state.classInstancePtr = classInstancePtr;
    this.state.methodName = methodName;
    this.state.args = argsBuffer;

    console.log({
      className,
      classInstancePtr,
      methodName,
      argsBuffer
    });

    console.log({
      className: this.state.className,
      classInstancePtr: this.state.classInstancePtr,
      methodName: this.state.methodName,
      args: this.state.args
    });

    const result = await exports._wrap_invoke_instance(
      this.state.className.length,
      this.state.classInstancePtr,
      this.state.methodName.length,
      this.state.args.byteLength,
    );

    if (result) {
      const resultBuffer = this.state.invoke.result;
      if (!resultBuffer) {
        return ResultErr("invoke instance Response is undefined");
      }

      return this.decodeResult<TData>(resultBuffer);
    } else {
      return ResultErr(this.state.invoke.error);
    }
  }

  async invokeStatic<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<Result<TData, string>> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const exports = this.wasmInstance.exports as WrapExports;

    this.state.className = className;
    this.state.methodName = methodName;
    this.state.args = argsBuffer;

    console.log({
      className,
      methodName,
      argsBuffer
    });

    console.log({
      className: this.state.className,
      methodName: this.state.methodName,
      args: this.state.args
    });

    const result = await exports._wrap_invoke(
      this.state.className.length,
      this.state.methodName.length,
      this.state.args.byteLength,
    );

    if (result) {
      const resultBuffer = this.state.invoke.result;
      if (!resultBuffer) {
        return ResultErr("Response is undefined");
      }

      return ResultOk(msgpackDecode(resultBuffer) as TData);
    } else {
      return ResultErr(this.state.invoke.error);
    }
  }

  parseArgsAndExtractReferences(args: any): Uint8Array {
    if (!!args && typeof args === "object" && !Array.isArray(args)) {
      const newObj: any = {};
      let isReference = false;
      for (const key of Object.keys(args)) {
        if (args[key] === "__classInstancePtr") {
          isReference = true;
          newObj[key] = args[key];
        } else if(typeof args[key] === "function") {
          isReference = true;
        } else {
          newObj[key] = args[key];
        }
      }


      if (isReference || getMethods(args).length) {
        newObj.__wrapInstancePtr = 0; 
        const count = ++this.classInstanceCount;
        newObj.__classInstancePtr = count; 
        this.state.classInstances.set(count, {
          className: "",
          classInstance: args
        });

      }
      /*
      WasmInstnance
        [
          provider: 1
        ]
        invoke(provider)
          -> Uniswap
      
          {
            age: 2,
            bark(): {

            }
          }

      */


      const ret = msgpackEncode(newObj);

      return ret;
    } else {
      console.log("parseArgsAndExtractReferences not a match");
      return msgpackEncode(args);
    }
  }

  decodeResult<TData>(resultBuffer: Uint8Array): Result<TData, string> {
    const resultObj: any = msgpackDecode(resultBuffer);

    if (typeof resultObj === "object" && !Array.isArray(resultObj)) {
      const newObj: any = {};
      let isReference = false;

      for (const key of Object.keys(resultObj)) {
        if (resultObj[key] === "__classInstancePtr") {
          isReference = true;
        }

        newObj[key] = resultObj[key];
      }

      // if(isReference) {
        newObj.__wrapInstance = this; 
      // }

      return ResultOk(newObj as TData);
    } else {
      return ResultOk(resultObj as TData);
    }
  }
}

function getMethods(obj: any): string[] {
  var res = [];
  for(var m in obj) {
      if(typeof obj[m] == "function") {
          res.push(m)
      }
  }
  return res;
}
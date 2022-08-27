import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { ResultErr, ResultOk, Result } from "@polywrap/result";
import { State } from "./State";
import { WrapExports } from "./WrapExports";
import { createImports } from "./createImports";
import { IWrapInstance, IWrapManifest } from "@polywrap/reim-new-wrap";

export class WasmInstance implements IWrapInstance {
  public static requiredExports: readonly string[] = ["_wrap_invoke_wasm"];

  private classInstanceCount: number = 0;

  constructor(public readonly manifest: IWrapManifest, private readonly state: State, private readonly wasmInstance: AsyncWasmInstance) {
    state.wasmInstance = this;
  }

  static async create<TEnv>(manifest: IWrapManifest, wasmModule: Uint8Array, env: TEnv): Promise<IWrapInstance> {
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
      inputBuffer: new Uint8Array(),
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

    return new WasmInstance(manifest, state, instance);
  }

  async invokeStatic<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<Result<TData, string>> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const exports = this.wasmInstance.exports as WrapExports;

    const resourceIdBuffer = Buffer.from([0, 0, 0, 0]);

    var tmp = new Uint8Array(resourceIdBuffer.byteLength + argsBuffer.byteLength);
    tmp.set(new Uint8Array(resourceIdBuffer), 0);
    tmp.set(new Uint8Array(argsBuffer), resourceIdBuffer.byteLength);

    this.state.inputBuffer = tmp;

    const result = await exports._wrap_invoke_wasm(
      this.state.inputBuffer.byteLength,
    );

    console.log("ACTUAL result " + result);

    if (result) {
      const resultBuffer = this.state.invoke.result;
      if (!resultBuffer) {
        return ResultErr("instantiate Response is undefined");
      }

      return ResultOk(msgpackDecode(resultBuffer) as TData);
    } else {
      return ResultErr(this.state.invoke.error);
    }
  }

  async invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<Result<TData, string>> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const exports = this.wasmInstance.exports as WrapExports;

    const module = this.manifest.abi.find((abi: any) => abi.name === "Module");

    if (!module) {
      throw "WasmWrapper: Module not found in manifest";
    }
    
    const resourceId = module.methods.map(x => x.name).indexOf(funcName);
    let resourceBuffer = new ArrayBuffer(4);
    new DataView(resourceBuffer).setUint32(0, resourceId);
    const resourceIdBuffer = new Uint8Array(resourceBuffer);

    var tmp = new Uint8Array(resourceIdBuffer.byteLength + argsBuffer.byteLength);
    tmp.set(new Uint8Array(resourceIdBuffer), 0);
    tmp.set(new Uint8Array(argsBuffer), resourceIdBuffer.byteLength);

    this.state.inputBuffer = tmp;

    const result = await exports._wrap_invoke_wasm(
      this.state.inputBuffer.byteLength,
    );

    console.log("ACTUAL result " + result);

    if (result) {
      const resultBuffer = this.state.invoke.result;
      if (!resultBuffer) {
        return ResultErr("instantiate Response is undefined");
      }

      return ResultOk(msgpackDecode(resultBuffer) as TData);
    } else {
      return ResultErr(this.state.invoke.error);
    }
  }

  async instantiate<TArgs>(className: string, args: TArgs): Promise<Result<number, string>> {
    return ResultErr(this.state.invoke.error);
  }

  async invokeInstance<TArgs, TData>(className: string, classInstancePtr: number, methodName: string, args: TArgs): Promise<Result<TData, string>> {
    return ResultErr(this.state.invoke.error);
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
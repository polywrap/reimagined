import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { ResultErr, ResultOk, Result } from "@polywrap/result";
import { IWrapInstance, IWrapManifest } from "@polywrap/reim-wrap";
import { IDtInstance } from "@polywrap/reim-dt";
import { mergeBuffers } from "./utils/mergeBuffers";
import { u32ToBuffer } from "./utils/u32ToBuffer";
import { findResourceIdForGlobalFunction } from "./findResourceIdForGlobalFunction";

export class WasmInstance implements IWrapInstance {
  public static requiredExports: readonly string[] = ["_wrap_invoke_wasm"];

  private classInstanceCount: number = 0;
  private classInstances = new Map();

  constructor(public readonly manifest: IWrapManifest, private readonly dtInstance: IDtInstance) {
  }

  async invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<Result<TData, string>> {

    const resourceId = findResourceIdForGlobalFunction(this.manifest.abi, funcName);

    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const result = await this.dtInstance.wrap_invoke_wasm(
      mergeBuffers(u32ToBuffer(resourceId), argsBuffer)
    );

    if (result.ok) {
      return ResultOk(msgpackDecode(result.value) as TData);
    } else {
      return result;
    }
  }

  async invokeStatic<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<Result<TData, string>> {
    return ResultErr("Not implemented");
  }

  async instantiate<TArgs>(className: string, args: TArgs): Promise<Result<number, string>> {
    return ResultErr("Not implemented");
  }

  async invokeInstance<TArgs, TData>(className: string, classInstancePtr: number, methodName: string, args: TArgs): Promise<Result<TData, string>> {
    return ResultErr("Not implemented");
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
        this.classInstances.set(count, {
          className: "",
          classInstance: args
        });

      }

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
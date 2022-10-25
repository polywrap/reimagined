import { ResultOk, Result } from "@polywrap/result";
import { IFunction, IWrapper, IWrapManifest } from "@polywrap/reim-wrap";
import { IDataTranslator } from "./IDataTranslator";
import { IDtInstance } from "@polywrap/reim-dt";
import { IDtReceiver } from "./IDtReceiver";
import { WrapperFunction } from "./WrapperFunction";

export class WasmWrapper implements IWrapper {
  private classInstanceCount: number = 0;
  private classInstances: Map<number, {
    className: string;
    classInstance: any
  }> = new Map();

  constructor(
    private readonly manifest: IWrapManifest, 
    private readonly dtInstance: IDtInstance, 
    private readonly dataTranslator: IDataTranslator,
    private readonly dtReceiver: IDtReceiver
  ) {
  }

  async invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<TData> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const funcInfo = getFuncInfo(funcName, this.manifest);
    const inputBuffer = concat([
      u32ToBuffer(WrapperFunction.InvokeGlobalFunction),
      u32ToBuffer(funcInfo.id),
      argsBuffer,
    ]);
    console.log(funcInfo.id, inputBuffer);

    const resultBuffer = await this.dtInstance.send(
      inputBuffer,
      this.dtReceiver.onReceive
    );

    if (funcInfo.func.returnType === "void") {
      return (undefined as unknown) as TData;
    }

    console.log("invokeGlobalFunction", resultBuffer);
    console.log("invokeGlobalFunction", new TextDecoder().decode(resultBuffer));

    return this.dataTranslator.decode(resultBuffer) as TData;
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

      const ret = this.dataTranslator.encode(newObj);

      return ret;
    } else {
      console.log("parseArgsAndExtractReferences not a match");
      return this.dataTranslator.encode(args);
    }
  }

  decodeResult<TData>(resultBuffer: Uint8Array): Result<TData, string> {
    const resultObj: any = this.dataTranslator.decode(resultBuffer);

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

export const concat = (array: Uint8Array[]): Uint8Array => {
  const totalLength = array.reduce((acc, cur) => acc + cur.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const item of array) {
    result.set(item, offset);
    offset += item.length;
  }

  return result;
};

export const stringToBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

export const u32ToBuffer = (num: number): Uint8Array => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);

  return new Uint8Array(b);
};

export const bufferToU32 = (buffer: Uint8Array): number => {
  return new DataView(buffer.buffer).getUint32(0);
};

export const getFuncInfo = (funcName: string, manifest: IWrapManifest): {
  id: number;
  func: IFunction
} => {
  const func = manifest.abi.find((func) => func.type === "function" && func.name === funcName);
  if (!func) {
    throw new Error(`Function ${funcName} not found`);
  }

  return {
    id: manifest.abi.indexOf(func),
    func: func as IFunction,
  };
};

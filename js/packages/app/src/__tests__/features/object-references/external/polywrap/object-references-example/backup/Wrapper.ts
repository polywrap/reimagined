import { ResultOk, Result } from "@polywrap/result";
import { IFunction, IWrapper, IWrapManifest, IClass, IMethod } from "@polywrap/reim-wrap";
import { IDataTranslator } from "./IDataTranslator";
import { IDtInstance } from "@polywrap/reim-dt";
import { IDtReceiver } from "./IDtReceiver";
import { WrapperResourceV_0_1 } from "./wrapper-resources/WrapperResourceV_0_1";
import { WrapperResourceV_0_2 } from "./wrapper-resources/WrapperResourceV_0_2";

export class Wrapper implements IWrapper {
  private objectReferenceCount: number = 0;
  private objectReferences: Map<number, {
    className: string;
    objectReference: any
  }> = new Map();
  private classes: Map<string, IClass> = new Map();

  constructor(
    private readonly manifest: IWrapManifest, 
    private readonly dtInstance: IDtInstance, 
    private readonly dataTranslator: IDataTranslator,
    private readonly dtReceiver: IDtReceiver,
  ) {
  }

  async invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<TData> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const funcInfo = getGlobalFunctionInfo(funcName, this.manifest);
    const inputBuffer = concat([
      u32ToBuffer(WrapperResourceV_0_1.InvokeGlobalFunction),
      u32ToBuffer(funcInfo.id),
      argsBuffer,
    ]);
    console.log(funcInfo.id, inputBuffer);

    const resultBuffer = await this.dtInstance.send(
      inputBuffer,
      (buffer) => this.dtReceiver.onReceive(buffer, this)
    );

    if (funcInfo.funcInfo.returnType === "void") {
      return (undefined as unknown) as TData;
    }

    console.log("invokeGlobalFunction", resultBuffer);
    console.log("invokeGlobalFunction", new TextDecoder().decode(resultBuffer));

    return this.dataTranslator.decode(resultBuffer) as TData;
  }

  async invokeClassMethod<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<TData> {
    const argsBuffer = this.parseArgsAndExtractReferences(args);

    const classInfo = getClassInfo(className, this.manifest);
    const methodInfo = getMethodInfo(classInfo.classInfo, methodName, this.manifest);
    const inputBuffer = concat([
      u32ToBuffer(WrapperResourceV_0_2.InvokeClassMethod),
      u32ToBuffer(classInfo.id),
      u32ToBuffer(methodInfo.id),
      argsBuffer,
    ]);

    console.log("invokeClassMethod", {
      classInfo,
      methodInfo,
    });

    const resultBuffer = await this.dtInstance.send(
      inputBuffer,
      (buffer) => this.dtReceiver.onReceive(buffer, this)
    );

    if (methodInfo.methodInfo.returnType === "void" && methodName !== "constructor") {
      return (undefined as unknown) as TData;
    }

    return this.dataTranslator.decode(resultBuffer) as TData;
  }

  async invokeHostClassMethod<TArgs, TData>(buffer: Uint8Array): Promise<TData> {
    const classType = bufferToU32(buffer);
    const method = bufferToU32(buffer, 4);
    const dataBuffer = buffer.slice(8);

    // const resultBuffer = await this.externalObjectManager.invokeClassMethod(classType, method, dataBuffer);

    // return this.dataTranslator.decode(resultBuffer) as TData;
    return (undefined as unknown) as TData;
  }

  parseArgsAndExtractReferences(args: any): Uint8Array {
    if (!!args && typeof args === "object" && !Array.isArray(args)) {
      const newObj: any = {};
      let isReference = false;
      for (const key of Object.keys(args)) {
        if (args[key] === "__objectReferencePtr") {
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
        const count = ++this.objectReferenceCount;
        newObj.__objectReferencePtr = count; 
        this.objectReferences.set(count, {
          className: "",
          objectReference: args
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
        if (resultObj[key] === "__objectReferencePtr") {
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

export const bufferToU32 = (buffer: Uint8Array, offset: number = 0): number => {
  return new DataView(buffer.buffer, offset).getUint32(0);
};

export const getGlobalFunctionInfo = (funcName: string, manifest: IWrapManifest): {
  id: number;
  funcInfo: IFunction
} => {
  const items = manifest.abi.filter(x => x.type === "function");
  const item = items.find(x => x.name === funcName);

  if (!item) {
    throw new Error(`Function ${funcName} not found`);
  }

  return {
    id: items.indexOf(item),
    funcInfo: item as IFunction,
  };
};

export const getClassInfo = (className: string, manifest: IWrapManifest): {
  id: number;
  classInfo: IClass
} => {
  const items = manifest.abi.filter(x => x.type === "class");
  const item = items.find(x => x.name === className);

  if (!item) {
    throw new Error(`Class ${className} not found`);
  }

  return {
    id: items.indexOf(item),
    classInfo: item as IClass,
  };
};

export const getMethodInfo = (classInfo: IClass, methodName: string, manifest: IWrapManifest): {
  id: number;
  methodInfo: IMethod
} => {
  const index = classInfo.methods.findIndex(x => x.name === methodName);

  if (index === -1) {
    throw new Error(`Method ${methodName} not found on class ${classInfo.name}`);
  }

  return {
    id: index,
    methodInfo: classInfo.methods[index] as IMethod,
  };
};

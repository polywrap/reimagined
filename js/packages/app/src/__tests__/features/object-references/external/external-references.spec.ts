import { IHost, IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { bufferToU32 } from "@polywrap/reim-wrap-dt";
import { WrapperWrapInstance } from "@polywrap/reim-wrap-js";
import { DtLoader } from "../../../DtLoader";
import { FileSystemLoader } from "../../../FileSystemLoader";
import { TestExternalClass } from "./polywrap/object-references-example/src";
import { InternalWrapInstance } from "./polywrap/object-references-example/src/polywrap/external/module/InternalWrapInstance";
import { WrapModule } from "./polywrap/object-references-example/src/polywrap/external/module/WrapModule";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/object-references-example/build`;

describe("Object references", () => {
  describe("External references", () => {
    it("can receive an object reference in a global function", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { testReceiveReference } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const externalObject = new TestExternalClass("test");

      const result = await testReceiveReference(externalObject);

      expect(result).toEqual("test instance");
    });

    it("can receive an object reference in a static method", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { TestObjectGetter } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const externalObject = new TestExternalClass("test");

      const result = await TestObjectGetter.testStaticReceiveReference(externalObject);

      expect(result).toEqual("test instance");
    });

    it("can receive an object reference in an instance method", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { TestObjectGetter } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const objectGetter = await TestObjectGetter.create("test 1");
      
      const externalObject = new TestExternalClass("test");

      const result = await objectGetter.testInstanceReceiveReference(externalObject);

      expect(result).toEqual("test instance");
    });

    it("can invoke an external global function", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { testInvokeExternalGlobalFunction } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const result = await testInvokeExternalGlobalFunction("test");

      expect(result).toEqual("test function");
    });

    it("can invoke an external static method", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { testInvokeExternalStaticMethod } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const result = await testInvokeExternalStaticMethod("test");

      expect(result).toEqual("test static");
    });

    it("can invoke an external instance method", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { testInvokeExternalInstanceMethod } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const result = await testInvokeExternalInstanceMethod("test");

      expect(result).toEqual("test instance");
    });
  });
});

// export const testInvokeExternalGlobalFunction = async (arg: string): Promise<string> => {
//   return arg + " function";
// };

// export class TestExternalClass {
//   constructor(arg: string) {
//     console.log("Created external TestExternalClass with arg: " + arg);
//   }

//   async testInstanceMethod(arg: string): Promise<string> {
//     return arg + " instance";
//   }
//   static async testStaticMethod(arg: string): Promise<string> {
//     return arg + " static";
//   }
// }

// export enum HostGlobalFunction {
//   TestInvokeExternalGlobalFunction = 0
// }

// export enum ClassList {
//   TestExternalClass = 0,
// }

// export enum TestExternalClassMethod {
//   Constructor = 0,
//   TestInstanceMethod = 1,
//   TestStaticMethod = 2,
// }

// export class Args {
//   constructor(
//     public __objectReferencePtr: number,
//     public args: MethodArgs
//   ) {}
// }

// export class MethodArgs {
//   constructor(
//     public arg: string
//   ) {}
// }

// export const deserializeType = (buffer: Uint8Array): Args => {
//   return JSON.parse(new TextDecoder().decode(buffer)) as Args;
// };

// export function serializeResult(result: string): Uint8Array {
//   return new TextEncoder().encode(JSON.stringify(result));
// };

// export function serializeTestExternalClassResult(result: number): Uint8Array {
//   return new TextEncoder().encode(JSON.stringify(result));
// };

// export const deserializeSimpleType = (buffer: Uint8Array): MethodArgs => {
//   return JSON.parse(new TextDecoder().decode(buffer)) as MethodArgs;
// };

// export const invokeConstructor = async (buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
//   console.log("invokeConstructor");
//   const args = deserializeSimpleType(buffer);

//   const result = new TestExternalClass(args.arg);

//   trackedReferenceMap.set(1, result);

//   return serializeTestExternalClassResult(1);
// };

// export const invokeTestInstanceMethod = async (buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
//   const args = deserializeType(buffer);

//   const object = trackedReferenceMap.get(args.__objectReferencePtr) as TestExternalClass;
//   const result = await object.testInstanceMethod(args.args.arg);

//   return serializeResult(result);
// };

// // TODO
// export const invokeTestStaticMethod = async (buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
//   const args = deserializeSimpleType(buffer);

//   const result = await TestExternalClass.testStaticMethod(args.arg);

//   return serializeResult(result);
// };

// export const invokeTestInvokeExternalGlobalFunction = async (buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
//   const args = deserializeSimpleType(buffer);

//   const result = await testInvokeExternalGlobalFunction(args.arg);

//   return serializeResult(result);
// };

// export const invokeTestExternalClassMethod = (method: TestExternalClassMethod, buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
//   switch(method) {
//     case TestExternalClassMethod.Constructor: 
//       return invokeConstructor(buffer, trackedReferenceMap);
//     case TestExternalClassMethod.TestInstanceMethod: 
//       return invokeTestInstanceMethod(buffer, trackedReferenceMap);
//     case TestExternalClassMethod.TestStaticMethod: 
//       return invokeTestStaticMethod(buffer, trackedReferenceMap);
//     default:
//       throw new Error(`Unknown method: ${method}`);
//   }
// };

// export class ObjectReferencesExampleHost implements IHost {
//   async invokeGlobalFunction(buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> {
//     console.log("ObjectReferencesExampleHost invokeGlobalFunction " + buffer);
//     const functionId = bufferToU32(buffer);
//     const dataBuffer = buffer.slice(4);
//     console.log("ObjectReferencesExampleHost functionId " + functionId);

//     switch(functionId) {
//       case HostGlobalFunction.TestInvokeExternalGlobalFunction: 
//         return await invokeTestInvokeExternalGlobalFunction(dataBuffer, trackedReferenceMap);
//       default:
//         throw new Error(`Unknown function: ${functionId}`);
//     }
//   }
 
//   async invokeClassMethod(buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> {
//     const classId = bufferToU32(buffer);
//     const method = bufferToU32(buffer, 4);
//     const dataBuffer = buffer.slice(8);

//     switch(classId) {
//       case ClassList.TestExternalClass: 
//         return await invokeTestExternalClassMethod(method, dataBuffer, trackedReferenceMap);
//       default:
//         throw new Error(`Unknown class: ${classId}`);
//     }
//   }
// }

// export class InternalWrapInstance extends WrapInstance {
//   constructor() {
//     super();
//   }

//   invokeResource(resource: u32, buffer: ArrayBuffer): ArrayBuffer {
//     switch(resource) {
//       case InternalResource.InvokeGlobalFunction: 
//         return this.invokeGlobalFunction(buffer);
//       case InternalResource.InvokeClassMethod: 
//         return this.invokeClassMethod(buffer);
//       default: 
//         throw new Error("Unknown function");
//     }
//   }

//   private async invokeGlobalFunction(buffer: Uint8Array): Promise<Uint8Array> {
//     const functionId = bufferToU32(buffer);
//     const dataBuffer = buffer.slice(4);

//     switch(functionId) {
//       case HostGlobalFunction.TestInvokeExternalGlobalFunction: 
//         return await invokeTestInvokeExternalGlobalFunction(dataBuffer);
//       default:
//         throw new Error(`Unknown function: ${functionId}`);
//     }
//   }
 
//   private async invokeClassMethod(buffer: Uint8Array): Promise<Uint8Array> {
//     const classId = bufferToU32(buffer);
//     const method = bufferToU32(buffer, 4);
//     const dataBuffer = buffer.slice(8);

//     switch(classId) {
//       case ClassList.TestExternalClass: 
//         return await invokeTestExternalClassMethod(method, dataBuffer);
//       default:
//         throw new Error(`Unknown class: ${classId}`);
//     }
//   }
// }
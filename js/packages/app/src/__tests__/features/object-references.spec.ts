import { IHost, IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { bufferToU32 } from "@polywrap/reim-wrap-dt";
import { FileSystemLoader } from "../FileSystemLoader";
import { ObjectReferencesExample } from "./polywrap/object-references-example";
import { IExternalReference } from "./polywrap/object-references-example/IExternalReference";
import { ITestExternalClass } from "./polywrap/object-references-example/ITestExternalClass";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/object-references-example/build`;

describe("Object references", () => {
  describe("Returning", () => {
    it("can return an object reference from a global function", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { testReturnReference } = ObjectReferencesExample.from(wrapper);

      const object = await testReturnReference("test");

      expect(object).toBeTruthy();
    });

    it("can invoke an instance method on a returned object reference from a global function", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { testReturnReference } = ObjectReferencesExample.from(wrapper);

      const object = await testReturnReference("test 1");

      const result = await object.testInstanceMethod("test 2");

      expect(result).toEqual("test 1 test 2");
    });

    it("can invoke an instance method on a returned object reference from a static method", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { TestObjectGetter } = ObjectReferencesExample.from(wrapper);

      const object = await TestObjectGetter.testStaticMethod("test 1");

      const result = await object.testInstanceMethod("test 2");

      expect(result).toEqual("test 1 test 2");
    });

    it("can invoke an instance method on a returned object reference from an instance method", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { TestObjectGetter } = ObjectReferencesExample.from(wrapper);

      const objectGetter = await TestObjectGetter.constructor("test 1");

      const object = await objectGetter.testInstanceMethod("test 2");

      const result = await object.testInstanceMethod("test 3");

      expect(result).toEqual("test 1 test 2 test 3");
    });
  });

  describe("Receiving", () => {
    it("can receive an object reference in a global function", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper(new ObjectReferencesExampleHost());

      const { testReceiveReference } = ObjectReferencesExample.from(wrapper);

      const externalObject = new TestExternalClass();

      const result = await testReceiveReference(externalObject);

      expect(result).toEqual("test");
    });

    it("can receive an object reference in a static method", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper(new ObjectReferencesExampleHost());

      const { TestObjectGetter } = ObjectReferencesExample.from(wrapper);

      const externalObject = new TestExternalClass();

      const result = await TestObjectGetter.testStaticReceiveReference(externalObject);

      expect(result).toEqual("test");
    });

    it("can receive an object reference in an instance method", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper(new ObjectReferencesExampleHost());

      const { TestObjectGetter } = ObjectReferencesExample.from(wrapper);

      const objectGetter = await TestObjectGetter.constructor("test 1");
      
      const externalObject = new TestExternalClass();

      const result = await objectGetter.testInstanceReceiveReference(externalObject);

      expect(result).toEqual("test");
    });
  });
});

export class TestExternalClass {
  testing = "haha";
  async testInstanceMethod(arg: string): Promise<string> {
    return arg;
  }
}

export enum HostGlobalFunction {
}

export enum ClassList {
  TestExternalClass = 0,
}

export enum TestExternalClassMethod {
  TestInstanceMethod = 0,
}

export class Args {
  constructor(
    public __objectReferencePtr: number,
    public args: MethodArgs
  ) {}
}

export class MethodArgs {
  constructor(
    public arg: string
  ) {}
}

export const deserializeType = (buffer: Uint8Array): Args => {
  return JSON.parse(new TextDecoder().decode(buffer)) as Args;
};

export function serializeResult(result: string): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(result));
};

export const invokeTestInstanceMethod = async (buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
  const args = deserializeType(buffer);

  const object = trackedReferenceMap.get(args.__objectReferencePtr) as TestExternalClass;
  const result = await object.testInstanceMethod(args.args.arg);

  return serializeResult(result);
};

export const invokeTestExternalClassMethod = (method: TestExternalClassMethod, buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> => {
  switch(method) {
    case TestExternalClassMethod.TestInstanceMethod: 
      return invokeTestInstanceMethod(buffer, trackedReferenceMap);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
};

export class ObjectReferencesExampleHost implements IHost {
  async invokeClassMethod(buffer: Uint8Array, trackedReferenceMap: Map<number, unknown>): Promise<Uint8Array> {
    const classId = bufferToU32(buffer);
    const method = bufferToU32(buffer, 4);
    const dataBuffer = buffer.slice(8);

    switch(classId) {
      case ClassList.TestExternalClass: 
        return await invokeTestExternalClassMethod(method, dataBuffer, trackedReferenceMap);
      default:
        throw new Error(`Unknown class: ${classId}`);
    }
  }
}

import { IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../FileSystemLoader";

jest.setTimeout(200000);

export interface StringArgFunctionArgs {
  arg: string
};

export interface ObjectArgFunctionArgs {
  arg: TestObject
};

export interface ObjectResultFunctionArgs {
  arg: TestObject
};

export interface TestObject {
  str: string,
  num: number
}

export class GlobalFunctionExample {
  constructor(private readonly __wrapper: IWrapper) {}

  static from(wrapper: IWrapper) {
    return new GlobalFunctionExample(wrapper);
  }

  functions() {
    return {
      stringArgFunction: async (arg: string): Promise<string> => {
        return await this.__wrapper.invokeGlobalFunction<StringArgFunctionArgs, string>("stringArgFunction", { arg });
      },
      objectArgFunction: async (arg: { str: string, num: number }): Promise<string> => {
        return await this.__wrapper.invokeGlobalFunction<ObjectArgFunctionArgs, string>("objectArgFunction", { arg });
      },
      objectResultFunction: async (arg: TestObject): Promise<TestObject> => {
        return await this.__wrapper.invokeGlobalFunction<ObjectResultFunctionArgs, TestObject>("objectResultFunction", { arg });
      },
    };
  }
}

describe("Global functions", () => {
  it("can invoke a global function with string arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();
    const exampleWrapper = GlobalFunctionExample.from(wrapper);

    const { stringArgFunction } = exampleWrapper.functions();

    const result = await stringArgFunction("test");

    expect(result).toEqual("test");
  });

  it("can invoke a global function with object arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();
    const exampleWrapper = GlobalFunctionExample.from(wrapper);

    const { objectArgFunction } = exampleWrapper.functions();

    const result = await objectArgFunction({
      str: "test",
      num: 1
    });

    expect(result).toEqual("test 1");
  });

  it("can invoke a global function with object result", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();
    const exampleWrapper = GlobalFunctionExample.from(wrapper);

    const { objectResultFunction } = exampleWrapper.functions();

    const result = await objectResultFunction({
      str: "test",
      num: 1
    });

    expect(result).toEqual({
      str: "test",
      num: 1
    });
  });
});

import { IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../FileSystemLoader";
import { GlobalFunctionExample } from "./polywrap/global-function-example";

jest.setTimeout(200000);

describe("Global functions", () => {
  it("can invoke a global function with string arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();
    const typedWrapper = GlobalFunctionExample.from(wrapper);

    const { stringArgFunction } = typedWrapper.functions();

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
    const typedWrapper = GlobalFunctionExample.from(wrapper);

    const { objectArgFunction } = typedWrapper.functions();

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
    const typedWrapper = GlobalFunctionExample.from(wrapper);

    const { objectResultFunction } = typedWrapper.functions();

    const result = await objectResultFunction({
      str: "test",
      num: 1
    });

    expect(result).toEqual({
      str: "test",
      num: 1
    });
  });

  it("can invoke a global function with nested object arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();
    const typedWrapper = GlobalFunctionExample.from(wrapper);

    const { nestedObjectArgFunction } = typedWrapper.functions();

    const result = await nestedObjectArgFunction({
      obj1: {
        str: "test1",
        num: 1
      },
      obj2: {
        str2: "test2",
        num2: 2
      }
    });

    expect(result).toEqual("test1 1 test2 2");
  });

  it("can invoke a global function with nested object result", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();
    const typedWrapper = GlobalFunctionExample.from(wrapper);

    const { nestedObjectResultFunction } = typedWrapper.functions();

    const result = await nestedObjectResultFunction({
      obj1: {
        str: "test1",
        num: 1
      },
      obj2: {
        str2: "test2",
        num2: 2
      }
    });

    expect(result).toEqual({
      obj1: {
        str: "test1",
        num: 1
      },
      obj2: {
        str2: "test2",
        num2: 2
      }
    });
  });
});

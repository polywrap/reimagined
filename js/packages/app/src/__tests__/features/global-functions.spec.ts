import { IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../FileSystemLoader";
import { GlobalFunctionExample } from "./polywrap/global-function-example";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/global-function-example/build`;

describe("Global functions", () => {
  it("can invoke a global function with string arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { stringArgFunction } = GlobalFunctionExample.from(wrapper);

    const result = await stringArgFunction("test");

    expect(result).toEqual("test");
  });

  it("can invoke a global function with object arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { objectArgFunction } = GlobalFunctionExample.from(wrapper);

    const result = await objectArgFunction({
      str: "test",
      num: 1
    });

    expect(result).toEqual("test 1");
  });

  it("can invoke a global function with object result", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { objectResultFunction } = GlobalFunctionExample.from(wrapper);

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
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { nestedObjectArgFunction } = GlobalFunctionExample.from(wrapper);

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
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { nestedObjectResultFunction } = GlobalFunctionExample.from(wrapper);

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

import { WrapperWrapInstance } from "@polywrap/reim-wrap-js";
import { DtLoader } from "../../DtLoader";
import { InternalWrapInstance } from "./polywrap/global-function-example/src/polywrap/external/module/InternalWrapInstance";
import { WrapModule } from "./polywrap/global-function-example/src/polywrap/external/module/WrapModule";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/global-function-example/build`;

describe("Global functions", () => {
  it("can invoke a global function with string arg", async () => {
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { stringArgFunction } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

    const result = await stringArgFunction("test");

    expect(result).toEqual("test");
  });

  it("can invoke a global function with object arg", async () => {
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { objectArgFunction } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

    const result = await objectArgFunction({
      str: "test",
      num: 1
    });

    expect(result).toEqual("test 1");
  });

  it("can invoke a global function with object result", async () => {
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { objectResultFunction } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

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
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { nestedObjectArgFunction } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

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
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { nestedObjectResultFunction } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

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

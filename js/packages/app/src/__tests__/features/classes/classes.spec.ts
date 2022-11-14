import { WrapperWrapInstance } from "@polywrap/reim-wrap-js";
import { DtLoader } from "../../DtLoader";
import { InternalWrapInstance } from "./polywrap/classes-example/src/polywrap/external/module/InternalWrapInstance";
import { WrapModule } from "./polywrap/classes-example/src/polywrap/external/module/WrapModule";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/classes-example/build`;

describe("Classes", () => {
  it("can invoke a static method with string arg", async () => {
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { TestClass } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

    const result = await TestClass.testStaticMethod("test");

    expect(result).toEqual("test");
  });

  it("can initialize an instance of a class with string ctor arg", async () => {
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { TestClass } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

    const test = await TestClass.create("test 1");

    expect(test).toBeTruthy();
  });

  it("can invoke an instance of method with string arg", async () => {
    const dtInstance = await new DtLoader().load(wrapperPath);

    const { TestClass } = WrapModule.import(
      new WrapperWrapInstance(
        dtInstance, 
        new InternalWrapInstance()
      )
    );

    const test = await TestClass.create("test 1");

    const result = await test.testInstanceMethod("test 2");

    expect(result).toEqual("test 1 test 2");
  });
});

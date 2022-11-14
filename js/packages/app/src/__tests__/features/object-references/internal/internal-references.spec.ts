import { WrapperWrapInstance } from "@polywrap/reim-wrap-js";
import { DtLoader } from "../../../DtLoader";
import { WrapModule } from "./polywrap/internal-references-example/src/polywrap/external/module/WrapModule";
import { InternalWrapInstance } from "./polywrap/internal-references-example/src/polywrap/external/module/InternalWrapInstance";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/internal-references-example/build`;

describe("Object references", () => {
  describe("Internal references", () => {
    it("can return an object reference from a global function", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);

      const { testReturnReference } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const object = await testReturnReference("test");

      expect(object).toBeTruthy();
    });

    it("can invoke an instance method on a returned object reference from a global function", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);
   
      const { testReturnReference } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const object = await testReturnReference("test 1");

      const result = await object.testInstanceMethod("test 2");

      expect(result).toEqual("test 1 test 2");
    });

    it("can invoke an instance method on a returned object reference from a static method", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);
   
      const { TestObjectGetter } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const object = await TestObjectGetter.testStaticMethod("test 1");

      const result = await object.testInstanceMethod("test 2");

      expect(result).toEqual("test 1 test 2");
    });

    it("can invoke an instance method on a returned object reference from an instance method", async () => {
      const dtInstance = await new DtLoader().load(wrapperPath);
   
      const { TestObjectGetter } = WrapModule.import(
        new WrapperWrapInstance(
          dtInstance, 
          new InternalWrapInstance()
        )
      );

      const objectGetter = await TestObjectGetter.create("test 1");

      const object = await objectGetter.testInstanceMethod("test 2");

      const result = await object.testInstanceMethod("test 3");

      expect(result).toEqual("test 1 test 2 test 3");
    });
  });
});

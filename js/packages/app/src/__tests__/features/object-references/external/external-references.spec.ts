import { WrapperWrapInstance } from "@polywrap/reim-wrap-js";
import { DtLoader } from "../../../DtLoader";
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

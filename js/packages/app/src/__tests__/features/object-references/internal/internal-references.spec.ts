import { IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../../../FileSystemLoader";
import { WrapModule as InternalReferencesExample } from "./polywrap/internal-references-example";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/object-references-example/build`;

describe("Object references", () => {
  describe("Internal references", () => {
    it("can return an object reference from a global function", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { testReturnReference } = InternalReferencesExample.import(wrapper);

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

      const { testReturnReference } = InternalReferencesExample.import(wrapper);

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

      const { TestObjectGetter } = InternalReferencesExample.import(wrapper);

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

      const { TestObjectGetter } = InternalReferencesExample.import(wrapper);

      const objectGetter = await TestObjectGetter.create("test 1");

      const object = await objectGetter.testInstanceMethod("test 2");

      const result = await object.testInstanceMethod("test 3");

      expect(result).toEqual("test 1 test 2 test 3");
    });
  });
});

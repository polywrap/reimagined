import { IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../FileSystemLoader";
import { ObjectReferencesExample } from "./polywrap/object-references-example";

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

      const { testGlobalFunction } = ObjectReferencesExample.from(wrapper);

      const object = await testGlobalFunction("test");

      expect(object).toBeTruthy();
    });

    it("can return an object reference from a static method", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { TestObjectGetter } = ObjectReferencesExample.from(wrapper);

      const object = await TestObjectGetter.testStaticMethod("test");

      expect(object).toBeTruthy();
    });

    it("can return an object reference from an instance method", async () => {
      const loader = new FileSystemLoader();
      
      const loadResult = await loader.load(wrapperPath);

      if (!loadResult.ok) {
        throw loadResult.error;
      }

      const wrapPackage: IWrapPackage = loadResult.value;
      const wrapper: IWrapper = await wrapPackage.createWrapper();

      const { TestObjectGetter } = ObjectReferencesExample.from(wrapper);

      const objectGetter = await TestObjectGetter.constructor("test");

      const object = await objectGetter.testInstanceMethod("test");

      expect(object).toBeTruthy();
    });
  });

  describe("Receiving", () => {
    it("can receive an object reference in a global function", async () => {
    });

    it("can receive an object reference in a static method", async () => {
    });

    it("can receive an object reference in an instance method", async () => {
    });
  });
});

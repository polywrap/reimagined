import { IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../FileSystemLoader";
import { ClassesExample } from "./polywrap/classes-example";

jest.setTimeout(200000);

//TODO: build this before the tests (currently needs to be manually built)
const wrapperPath = `${__dirname}/wrappers/classes-example/build`;

describe("Classes", () => {
  it("can invoke a static method with string arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage: IWrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { TestClass } = ClassesExample.from(wrapper);

    const result = await TestClass.testStaticMethod("test");

    expect(result).toEqual("test");
  });

  it("can initialize an instance of a class with string ctor arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage: IWrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { TestClass } = ClassesExample.from(wrapper);

    const test = await TestClass.constructor("test 1");

    expect(test).toBeTruthy();
  });

  it("can invoke an instance of method with string arg", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(wrapperPath);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage: IWrapPackage = loadResult.value;
    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const { TestClass } = ClassesExample.from(wrapper);

    const test = await TestClass.constructor("test 1");

    const result = await test.testInstanceMethod("test 2");

    expect(result).toEqual("test 1 test 2");
  });
});

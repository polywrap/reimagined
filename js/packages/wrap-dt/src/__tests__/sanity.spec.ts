import { FileSystemLoader } from "./FileSystemLoader";
import { IWrapPackage } from "@polywrap/reim-wrap";

jest.setTimeout(200000);

const wrapperPath = `${__dirname}/wrappers/simple-wrapper/build`;

describe("Sanity", () => {
  let wrapPackage: IWrapPackage;

  beforeAll(async () => {
    const loader = new FileSystemLoader();
    const result = await loader.load(wrapperPath);

    if (!result.ok) {
      throw result.error;
    }

    wrapPackage = result.value;
  });

  it("sanity", async () => {
    const wrapper = await wrapPackage.createWrapper();
    const result = await wrapper.invokeGlobalFunction("simpleMethod", { arg: "test" });
    
    console.log(result);

    expect(result).toEqual("test");
  });
});

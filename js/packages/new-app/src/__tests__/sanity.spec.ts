import { IPackageLoader } from "@polywrap/reim-loader";
import { IWrapPackage, IWrapInstance} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../loader/FileSystemLoader";
import { MyWrapper__factory } from "../wrap/MyWrapper/wrapper";

jest.setTimeout(200000);

describe("sanity", () => {
  test("sanity", async () => {
    const loader: IPackageLoader = new FileSystemLoader();
    
    const wrapPackage: IWrapPackage = await loader.load(`${__dirname}/../../../../../codegen-wrapper/build`) as IWrapPackage;
    const wrapper: IWrapInstance = await wrapPackage.createInstance();

    const { simpleMethod, anotherMethod } = await MyWrapper__factory.fromWrapper(wrapper);

    const result = await simpleMethod("Hello");
    const result2 = await anotherMethod("what");
 
    console.log(result);
    console.log(result2);

    expect(result).toEqual("Hello");
  });
});

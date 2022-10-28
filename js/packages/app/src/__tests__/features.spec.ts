import { IWrapPackage, IWrapper} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "./FileSystemLoader";

jest.setTimeout(200000);

export type SimpleFunctionType = (arg: string) => string; 
export interface SimpleFunctionArgs {
  arg: string
};

export class GlobalFunctionExample {
  constructor(private readonly __wrapper: IWrapper) {}

  static async from(wrapper: IWrapper) {
    return new GlobalFunctionExample(wrapper);
  }

  functions() {
    return {
      simpleFunction: async (arg: string): Promise<string> => {
        return await this.__wrapper.invokeGlobalFunction<SimpleFunctionArgs, string>("simpleFunction", { arg });
      }
    };
  }
}

describe("Features", () => {
  it("can invoke a global function", async () => {
    const loader = new FileSystemLoader();
    
    const loadResult = await loader.load(`${__dirname}/wrappers/global-function-example/build`);

    if (!loadResult.ok) {
      throw loadResult.error;
    }

    const wrapPackage = loadResult.value;

    const wrapper: IWrapper = await wrapPackage.createWrapper();

    const exampleWraper = await GlobalFunctionExample.from(wrapper);
    const { simpleFunction } = exampleWraper.functions();

    const result = await simpleFunction("test");

    console.log("result", result);
    expect(result).toEqual("test");
  });
});

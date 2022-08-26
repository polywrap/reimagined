import { IPackageLoader } from "@polywrap/reim-loader";
import { IWrapPackage, IWrapInstance} from "@polywrap/reim-wrap";
import { FileSystemLoader } from "../FileSystemLoader";
import { IUniswap_SimpleMethodArgs } from "../codegen/uniswap/Uniswap";

jest.setTimeout(200000);

type SimpleMethodType = (arg: string) => Promise<string>;

class MyWrapper__factory {
  static async fromWrapper(wrapper: IWrapInstance): Promise<
  {
    simpleMethod: SimpleMethodType
  }> {
    return {
      simpleMethod: async (arg: string): Promise<string> => {
        console.log("simpleMethod " + arg);
        const result = await wrapper.invokeStatic<IUniswap_SimpleMethodArgs, string>(
          MyWrapper.__className,
          "simpleMethod",
          {
            arg
          }
        );

        if (!result.ok) {
          throw result.error;
        }

        return result.value;
      }
    };
  }
}


export class MyWrapper {
  constructor(public readonly __wrapper: IWrapInstance) {
  }

  public static __className: string = "MyWrapper";

  async simpleMethod(arg: string): Promise<string> {
    console.log("simpleMethod " + arg);
    const result = await this.__wrapper.invokeStatic<IUniswap_SimpleMethodArgs, string>(
      MyWrapper.__className,
      "simpleMethod",
      {
        arg
      }
    );

    if (!result.ok) {
      throw result.error;
    }

    return result.value;
  }
}

describe("sanity", () => {
  test("sanity", async () => {
    console.log("sanitysanitysanitysanitysanity ");
    const loader: IPackageLoader = new FileSystemLoader();
    
    const wrapPackage: IWrapPackage = await loader.load(`${__dirname}/../../../../../codegen-wrapper/build`);
    const wrapper: IWrapInstance = await wrapPackage.createWrapper();

    const { simpleMethod } = await MyWrapper__factory.fromWrapper(wrapper);

    const result = await simpleMethod("Hello");
 
    console.log(result);

    expect(result).toEqual("Hello");
  });
});

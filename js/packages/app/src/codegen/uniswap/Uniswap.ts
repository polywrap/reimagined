import { IWrapInstance } from "@polywrap/reim-wrap";

export interface IUniswapModule {
  simpleMethod(arg: string): Promise<string>;
}

export interface IUniswap_SimpleMethodArgs {
  arg: string;
};

export class UniswapModule implements IUniswapModule {
  constructor(public readonly __wrapper: IWrapInstance, public readonly __classInstancePtr: number) {
  }

  public static __className: string = "Module";

  async simpleMethod(arg: string): Promise<string> {
    const result = await this.__wrapper.invokeStatic<IUniswap_SimpleMethodArgs, string>(
      UniswapModule.__className,
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

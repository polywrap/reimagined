import { IWrapInstance, WrapClassInstance } from "@polywrap/reim-wrap";
import { IUniswap_SimpleMethodArgs } from "../uniswap/Uniswap";
import { EthereumSigner } from "./EthereumSigner";
import { ICalc } from "./ICalc";

export interface IEthereumProvider {
  instanceMethod(arg: string): Promise<string>;
  getSigner(): Promise<EthereumSigner>;
  increment(calc: ICalc): Promise<string>;
}

export interface IEthereumProviderArgs {
  arg: string;
}

export class EthereumProvider implements IEthereumProvider {
  constructor(public readonly __wrapper: IWrapInstance, public readonly __classInstancePtr: number) {
  }

  public static __className: string = "EthereumProvider";

  async instanceMethod(arg: string): Promise<string> {
    const result = await this.__wrapper.invokeInstance<IUniswap_SimpleMethodArgs, string>(
      EthereumProvider.__className,
      this.__classInstancePtr,
      "instanceMethod",
      {
        arg
      }
    );

    if (!result.ok) {
      throw result.error;
    }

    return result.value;
  }

  async getSigner(): Promise<EthereumSigner> {
    const result = await this.__wrapper.invokeInstance<undefined, WrapClassInstance>(
      EthereumProvider.__className,
      this.__classInstancePtr,
      "getSigner",
      undefined
    );

    if (!result.ok) {
      throw result.error;
    }

    return new EthereumSigner(result.value.__wrapInstance, result.value.__classInstancePtr);
  }

  async increment(calc: ICalc): Promise<string> {
    const result = await this.__wrapper.invokeInstance<ICalc, string>(
      EthereumProvider.__className,
      this.__classInstancePtr,
      "increment",
      calc
    );

    if (!result.ok) {
      throw result.error;
    }

    return result.value;
  }
}

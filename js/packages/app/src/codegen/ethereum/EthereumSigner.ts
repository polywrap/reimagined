import { IWrapInstance } from "@polywrap/reim-wrap";

export interface IEthereumSigner {
  getAddress(): Promise<string>;
}

export interface IEthereumSignerArgs {
  address: string;
}

export class EthereumSigner implements IEthereumSigner {
  constructor(public readonly __wrapper: IWrapInstance, public readonly __classInstancePtr: number) {
  }

  public static __className: string = "EthereumSigner";

  async getAddress(): Promise<string> {
    const result = await this.__wrapper.invokeInstance<undefined, string>(
      EthereumSigner.__className,
      this.__classInstancePtr,
      "getAddress",
      undefined
    );

    if (!result.ok) {
      throw result.error;
    }

    return result.value;
  }
}

import { IExternalInterface } from "./wrap/wrapped/IExternalInterface/IExternalInterface";

export function internalFunction(arg: string): string {
  return arg;
}

export class EthereumProvider {
  constructor(private someArg: string) {
  }

  // Example of an instance method and instance state
  instanceMethod(arg: string): string {
    this.someArg = this.someArg + " " + arg;

    return this.someArg;
  }

  // Example of returning a new class instance
  getSigner(): EthereumSigner {
    return new EthereumSigner(this.someArg);
  }

  // Example of receiving an external class instance with a field (state)
  increment(ext: IExternalInterface): string {
    return ext.instanceMethod("sds");
  }
}

export class EthereumSigner {
  constructor(private address: string) {
  }

  getAddress(): string {
    return this.address;
  }
}

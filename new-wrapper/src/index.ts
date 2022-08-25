import { ICalc } from "./wrap/ICalc";

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
  increment(calc: ICalc): string {
    return calc.increment();
  }
}

export class EthereumSigner {
  constructor(private address: string) {
  }

  getAddress(): string {
    return this.address;
  }
}

import { Args_simpleMethod } from "./wrap";
import { ICalc } from "./wrap/ICalc";

export function simpleMethod(args: Args_simpleMethod): string {
  return args.arg;
}

export class EthereumProvider {
  constructor(private someArg: string) {
  }

  // Example of an instance method and instance state
  instanceMethod(args: Args_simpleMethod): string {
    this.someArg = this.someArg + " " + args.arg;

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

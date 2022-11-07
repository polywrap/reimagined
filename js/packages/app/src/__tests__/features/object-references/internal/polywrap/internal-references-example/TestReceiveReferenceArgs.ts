import { IExternalReference } from "./IExternalReference";
import { ITestExternalClass } from "./ITestExternalClass";

export class TestReceiveReferenceArgs {
  constructor(arg: ITestExternalClass) {
    this.arg = {
      invokeClassMethod: (methodName: string, args: { arg: string }) => {
        return (arg as any)[methodName](args.arg);
      }
    } as IExternalReference;
  }

  arg: IExternalReference;
}

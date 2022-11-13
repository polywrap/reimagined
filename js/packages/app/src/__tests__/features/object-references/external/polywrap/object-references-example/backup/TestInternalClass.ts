import { IWrapper } from "@polywrap/reim-wrap";
import { TestInstanceMethodArgs } from "./TestInstanceMethodArgs";


export class TestInternalClass {
  constructor(private readonly __wrapper: IWrapper, private readonly __objectReferencePtr: number) {
  }

  testInstanceMethod(arg: string): Promise<string> {
    return this.__wrapper.invokeClassMethod<{
      objectReferencePtr: number;
      args: TestInstanceMethodArgs;
    }, string>(
      "TestInternalClass",
      "testInstanceMethod",
      {
        objectReferencePtr: this.__objectReferencePtr,
        args: { arg }
      }
    );
  }
}

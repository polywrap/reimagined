import { IWrapper } from "@polywrap/reim-wrap";
import { TestInstanceMethodArgs } from "../../TestInstanceMethodArgs";

const CLASS_NAME = "TestInternalClass";

export class TestInternalClass {
  constructor(private readonly __wrapper: IWrapper, private readonly __objectReferencePtr: number) {
  }

  testInstanceMethod(arg: string): Promise<string> {
    return this.__wrapper.invokeClassMethod<{
      objectReferencePtr: number;
      args: TestInstanceMethodArgs;
    }, string>(
      CLASS_NAME,
      "testInstanceMethod",
      {
        objectReferencePtr: this.__objectReferencePtr,
        args: { arg }
      }
    );
  }
}

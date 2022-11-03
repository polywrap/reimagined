import { IWrapper } from "@polywrap/reim-wrap";

const CLASS_NAME = "TestClass";

export type TestInstanceMethodArgs = {
  arg: string;
};

export class TestClass {
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

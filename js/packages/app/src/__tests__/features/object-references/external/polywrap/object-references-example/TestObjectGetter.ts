import { IWrapper } from "@polywrap/reim-wrap";
import { TestInstanceMethodArgs } from "./TestInstanceMethodArgs";
import { IObjectReference } from "./IObjectReference";
import { TestInternalClass } from "./TestInternalClass";
import { ITestExternalClass } from "./ITestExternalClass";

export class TestObjectGetter {
  constructor(private readonly __wrapper: IWrapper, private readonly __objectReferencePtr: number) {
  }

  async testInstanceMethod(arg: string): Promise<TestInternalClass> {
    const object = await this.__wrapper.invokeClassMethod<{
      objectReferencePtr: number;
      args: TestInstanceMethodArgs;
    }, IObjectReference>(
      "TestObjectGetter",
      "testInstanceMethod",
      {
        objectReferencePtr: this.__objectReferencePtr,
        args: { arg }
      }
    );

    return new TestInternalClass(this.__wrapper, object.__objectReferencePtr);
  }

  async testInstanceReceiveReference(arg: ITestExternalClass): Promise<string> {
    const result = await this.__wrapper.invokeClassMethod<{
      objectReferencePtr: number;
      args: { arg: ITestExternalClass };
    }, string>(
      "TestObjectGetter",
      "testInstanceReceiveReference",
      {
        objectReferencePtr: this.__objectReferencePtr,
        args: { arg }
      }
    );

    return result;
  }
}

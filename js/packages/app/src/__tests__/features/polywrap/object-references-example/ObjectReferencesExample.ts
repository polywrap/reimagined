import { IWrapper } from "@polywrap/reim-wrap";
import { TestInstanceMethodArgs } from "./TestInstanceMethodArgs";

export class ObjectReferencesExample {
  static from(wrapper: IWrapper) {
    return {
      testGlobalFunction: async (arg: string): Promise<TestInternalClass> => {
        const objectReferencePtr = await wrapper.invokeGlobalFunction<TestInstanceMethodArgs, number>("testGlobalFunction", { arg });

        return new TestInternalClass(wrapper, objectReferencePtr);
      },
      TestInternalClass: {
        async constructor(arg: string): Promise<TestInternalClass> {
          const objectReferencePtr = await wrapper.invokeClassMethod<TestInstanceMethodArgs, number>("TestInternalClass", "constructor", { arg });

          return new TestInternalClass(wrapper, objectReferencePtr);
        }
      },
      TestObjectGetter:{
        async constructor(arg: string): Promise<TestObjectGetter> {
          const objectReferencePtr = await wrapper.invokeClassMethod<TestInstanceMethodArgs, number>("TestObjectGetter", "constructor", { arg });

          return new TestObjectGetter(wrapper, objectReferencePtr);
        },
        async testStaticMethod(arg: string): Promise<TestInternalClass> {
          const objectReferencePtr = await wrapper.invokeClassMethod<TestInstanceMethodArgs, number>("TestObjectGetter", "testStaticMethod", { arg });

          return new TestInternalClass(wrapper, objectReferencePtr);
        }
      }
    };
  }
}

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

export class TestObjectGetter {
  constructor(private readonly __wrapper: IWrapper, private readonly __objectReferencePtr: number) {
  }

  async testInstanceMethod(arg: string): Promise<TestInternalClass> {
    const objectReferencePtr = await this.__wrapper.invokeClassMethod<{
      objectReferencePtr: number;
      args: TestInstanceMethodArgs;
    }, number>(
      "TestObjectGetter", 
      "testInstanceMethod", 
      { 
        objectReferencePtr: this.__objectReferencePtr, 
        args: { arg } 
      }
    );

    return new TestInternalClass(this.__wrapper, objectReferencePtr);
  }
}

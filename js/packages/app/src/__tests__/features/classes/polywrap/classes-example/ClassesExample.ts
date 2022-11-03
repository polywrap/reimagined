import { IWrapper } from "@polywrap/reim-wrap";
import { TestInstanceMethodArgs } from "./TestInstanceMethodArgs";

export class ClassesExample {
  static from(wrapper: IWrapper) {
    return {
      TestClass: {
        async create(arg: string): Promise<TestClass> {
          const objectReferencePtr = await wrapper.invokeClassMethod<TestInstanceMethodArgs, number>("TestClass", "create", { arg });

          console.log("create resultaaa: ", objectReferencePtr);
          return new TestClass(wrapper, objectReferencePtr);
        },
        testStaticMethod(arg: string): Promise<string> {
          return wrapper.invokeClassMethod<TestInstanceMethodArgs, string>("TestClass", "testStaticMethod", { arg });
        }
      }
    };
  }
}

export class TestClass {
  constructor(private readonly __wrapper: IWrapper, private readonly __objectReferencePtr: number) {
  }

  testInstanceMethod(arg: string): Promise<string> {
    return this.__wrapper.invokeClassMethod<{
      objectReferencePtr: number;
      args: TestInstanceMethodArgs;
    }, string>(
      "TestClass", 
      "testInstanceMethod", 
      { 
        objectReferencePtr: this.__objectReferencePtr, 
        args: { arg } 
      }
    );
  }
}

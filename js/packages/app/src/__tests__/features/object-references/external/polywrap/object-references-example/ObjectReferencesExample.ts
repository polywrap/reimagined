import { IWrapper } from "@polywrap/reim-wrap";
import { IObjectReference } from "./IObjectReference";
import { ITestExternalClass } from "./ITestExternalClass";
import { TestInstanceMethodArgs } from "./TestInstanceMethodArgs";
import { TestInternalClass } from "./TestInternalClass";
import { TestObjectGetter } from "./TestObjectGetter";

export class ObjectReferencesExample {
  static from(wrapper: IWrapper) {
    return {
      testReturnReference: async (arg: string): Promise<TestInternalClass> => {
        const object = await wrapper.invokeGlobalFunction<TestInstanceMethodArgs, IObjectReference>("testReturnReference", { arg });

        return new TestInternalClass(wrapper, object.__objectReferencePtr);
      },
      testReceiveReference: async (arg: ITestExternalClass): Promise<string> => {
        return await wrapper.invokeGlobalFunction<{ arg: ITestExternalClass }, string>(
          "testReceiveReference", 
          { arg }
        );
      },
      testInvokeExternalInstanceMethod: async (arg: string): Promise<string> => {
        return await wrapper.invokeGlobalFunction<{ arg: string }, string>(
          "testInvokeExternalInstanceMethod", 
          { arg }
        );
      },
      testInvokeExternalStaticMethod: async (arg: string): Promise<string> => {
        return await wrapper.invokeGlobalFunction<{ arg: string }, string>(
          "testInvokeExternalStaticMethod", 
          { arg }
        );
      },
      testInvokeExternalGlobalFunction: async (arg: string): Promise<string> => {
        return await wrapper.invokeGlobalFunction<{ arg: string }, string>(
          "testInvokeExternalGlobalFunction", 
          { arg }
        );
      },
      TestInternalClass: {
        async create(arg: string): Promise<TestInternalClass> {
          const object = await wrapper.invokeClassMethod<TestInstanceMethodArgs, IObjectReference>("TestInternalClass", "constructor", { arg });

          return new TestInternalClass(wrapper, object.__objectReferencePtr);
        }
      },
      TestObjectGetter:{
        async create(arg: string): Promise<TestObjectGetter> {
          const objectReferencePtr = await wrapper.invokeClassMethod<TestInstanceMethodArgs, number>("TestObjectGetter", "constructor", { arg });

          return new TestObjectGetter(wrapper, objectReferencePtr);
        },
        async testStaticMethod(arg: string): Promise<TestInternalClass> {
          const object = await wrapper.invokeClassMethod<TestInstanceMethodArgs, IObjectReference>("TestObjectGetter", "testStaticMethod", { arg });

          return new TestInternalClass(wrapper, object.__objectReferencePtr);
        },
        async testStaticReceiveReference(arg: ITestExternalClass): Promise<string> {
          return wrapper.invokeClassMethod<{ arg: ITestExternalClass }, string>("TestObjectGetter", "testStaticReceiveReference", { arg });
        }
      }
    };
  }
}

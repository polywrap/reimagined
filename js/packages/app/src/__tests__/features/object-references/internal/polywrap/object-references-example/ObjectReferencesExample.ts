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
      TestInternalClass: {
        async create(arg: string): Promise<TestInternalClass> {
          const object = await wrapper.invokeClassMethod<TestInstanceMethodArgs, IObjectReference>("TestInternalClass", "create", { arg });

          return new TestInternalClass(wrapper, object.__objectReferencePtr);
        }
      },
      TestObjectGetter:{
        async create(arg: string): Promise<TestObjectGetter> {
          const objectReferencePtr = await wrapper.invokeClassMethod<TestInstanceMethodArgs, number>("TestObjectGetter", "create", { arg });

          console.log("objectReferencePtr", objectReferencePtr);
          return new TestObjectGetter(wrapper, objectReferencePtr);
        },
        async testStaticMethod(arg: string): Promise<TestInternalClass> {
          const object = await wrapper.invokeClassMethod<TestInstanceMethodArgs, IObjectReference>("TestObjectGetter", "testStaticMethod", { arg });

          return new TestInternalClass(wrapper, object.__objectReferencePtr);
        },
      }
    };
  }
}

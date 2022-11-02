import { IWrapper } from "@polywrap/reim-wrap";
import { testStaticReceiveReferenceWrapped } from "../../wrappers/object-references-example/src/polywrap/wrapped/classes/list/TestObjectGetter/methods/testStaticReceiveReference";
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
      TestInternalClass: {
        async constructor(arg: string): Promise<TestInternalClass> {
          const object = await wrapper.invokeClassMethod<TestInstanceMethodArgs, IObjectReference>("TestInternalClass", "constructor", { arg });

          return new TestInternalClass(wrapper, object.__objectReferencePtr);
        }
      },
      TestObjectGetter:{
        async constructor(arg: string): Promise<TestObjectGetter> {
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

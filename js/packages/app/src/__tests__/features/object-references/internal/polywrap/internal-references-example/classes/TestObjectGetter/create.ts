import { IWrapper } from "@polywrap/reim-wrap";
import { TestInternalClass } from "../TestInternalClass/TestInternalClass";
import { TestObjectGetter } from "./TestObjectGetter";

export const create = (wrapper: IWrapper) => {
  return {
    async create(arg: string): Promise<TestObjectGetter> {
      const object = await wrapper.invokeClassMethod<CreateArgs, number>("TestObjectGetter", "create", { arg });

      return new TestObjectGetter(wrapper, object.__objectReferencePtr);
    },
    testStaticMethod(arg: string): Promise<TestInternalClass> {
      const object = wrapper.invokeClassMethod<TestStaticMethodArgs, string>("TestObjectGetter", "testStaticMethod", { arg });
 
      return new TestInternalClass(wrapper, object.__objectReferencePtr);
    }
  };
};

type CreateArgs = {
  arg: string;
};

type TestStaticMethodArgs = {
  arg: string;
};

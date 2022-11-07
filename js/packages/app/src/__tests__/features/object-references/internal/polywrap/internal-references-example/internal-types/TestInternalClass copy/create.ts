import { IWrapper } from "@polywrap/reim-wrap";
import { TestInternalClass } from "../TestInternalClass/TestInternalClass";

export const create = (wrapper: IWrapper) => {
  return {
    async create(arg: string): Promise<TestInternalClass> {
      const objectReferencePtr = await wrapper.invokeClassMethod<CreateArgs, number>("TestInternalClass", "create", { arg });

      return new TestInternalClass(wrapper, objectReferencePtr);
    },
    testStaticMethod(arg: string): Promise<string> {
      return wrapper.invokeClassMethod<TestStaticMethodArgs, string>("TestClass", "testStaticMethod", { arg });
    }
  };
};

type CreateArgs = {
  arg: string;
};

type TestStaticMethodArgs = {
  arg: string;
};

import { IWrapper } from "@polywrap/reim-wrap";
import { TestClass } from "../../types/TestClass/TestClass";

type CreateArgs = {
  arg: string;
};

type TestStaticMethodArgs = {
  arg: string;
};

export const create = (wrapper: IWrapper) => {
  return {
    async create(arg: string): Promise<TestClass> {
      const objectReferencePtr = await wrapper.invokeClassMethod<CreateArgs, number>("TestClass", "create", { arg });

      return new TestClass(wrapper, objectReferencePtr);
    },
    testStaticMethod(arg: string): Promise<string> {
      return wrapper.invokeClassMethod<TestStaticMethodArgs, string>("TestClass", "testStaticMethod", { arg });
    }
  };
};

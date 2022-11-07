import { IWrapper } from "@polywrap/reim-wrap";
import { TestInternalClass } from "./TestInternalClass";

const CLASS_NAME = "TestInternalClass";

export const create = (wrapper: IWrapper) => {
  return {
    async create(arg: string): Promise<TestInternalClass> {
      const object = await wrapper.invokeClassMethod<CreateArgs, SerializableTestInternalClass>(CLASS_NAME, "create", { arg });

      return new TestInternalClass(wrapper, object.__referencePtr);
    },
    testStaticMethod(arg: string): Promise<string> {
      return wrapper.invokeClassMethod<TestStaticMethodArgs, string>(CLASS_NAME, "testStaticMethod", { arg });
    }
  };
};

type CreateArgs = {
  arg: string;
};

type TestStaticMethodArgs = {
  arg: string;
};

type SerializableTestInternalClass = {
  __referencePtr: number;
};
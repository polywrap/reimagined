import { IWrapper } from "@polywrap/reim-wrap";
import { TestInternalClass } from "../TestInternalClass/TestInternalClass";
import { TestObjectGetter } from "./TestObjectGetter";

export const create = (wrapper: IWrapper) => {
  return {
    async create(arg: string): Promise<TestObjectGetter> {
      const object = await wrapper.invokeClassMethod<CreateArgs, SerializableTestObjectGetter>("TestObjectGetter", "create", { arg });

      return new TestObjectGetter(wrapper, object.__referencePtr);
    },
    async testStaticMethod(arg: string): Promise<TestInternalClass> {
      const object = await wrapper.invokeClassMethod<TestStaticMethodArgs, string>("TestObjectGetter", "testStaticMethod", { arg });
 
      return new TestInternalClass(wrapper, object.__referencePtr);
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
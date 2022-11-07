import { IWrapper } from "@polywrap/reim-wrap";
import { IObjectReference } from "../../IObjectReference";
import { 
  TestInternalClass, 
} from "../../classes";

export const create = (wrapper: IWrapper) => {
  return async (arg: string): Promise<TestInternalClass> => {
    const object = await wrapper.invokeGlobalFunction<Args, IObjectReference>("testReturnReference", { arg });

    return new TestInternalClass(wrapper, object.__objectReferencePtr);
  };
};

type Args = {
  arg: string;
};

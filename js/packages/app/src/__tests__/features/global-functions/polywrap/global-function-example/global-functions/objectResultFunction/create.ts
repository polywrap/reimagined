import { IWrapper } from "@polywrap/reim-wrap";
import { 
  TestObject, 
} from "../../types";

export const create = (wrapper: IWrapper) => {
  return (arg: TestObject): Promise<TestObject> => {
    return wrapper.invokeGlobalFunction<Args, TestObject>("objectResultFunction", { arg });
  };
};

type Args = {
  arg: TestObject;
};

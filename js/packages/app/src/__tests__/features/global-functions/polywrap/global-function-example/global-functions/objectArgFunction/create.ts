import { IWrapper } from "@polywrap/reim-wrap";
import { 
  TestObject, 
} from "../../types";

export const create = (wrapper: IWrapper) => {
  return (arg: TestObject): Promise<string> => {
    return wrapper.invokeGlobalFunction<Args, string>("objectArgFunction", { arg });
  };
};

type Args = {
  arg: TestObject;
};

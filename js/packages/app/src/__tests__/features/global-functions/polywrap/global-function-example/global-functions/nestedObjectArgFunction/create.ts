import { IWrapper } from "@polywrap/reim-wrap";
import { 
  ObjectWithChildren, 
} from "../../types";

export const create = (wrapper: IWrapper) => {
  return (arg: ObjectWithChildren): Promise<ObjectWithChildren> => {
    return wrapper.invokeGlobalFunction<Args, ObjectWithChildren>("nestedObjectArgFunction", { arg });
  };
};

type Args = {
  arg: ObjectWithChildren;
};

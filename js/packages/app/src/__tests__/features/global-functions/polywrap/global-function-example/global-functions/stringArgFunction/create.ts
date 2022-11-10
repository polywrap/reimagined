import { IWrapper } from "@polywrap/reim-wrap";

export const create = (wrapper: IWrapper) => {
  return (arg: string): Promise<string> => {
    return wrapper.invokeGlobalFunction<Args, string>("stringArgFunction", { arg });
  };
};

type Args = {
  arg: string;
};

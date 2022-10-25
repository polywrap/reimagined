import { Result } from "@polywrap/result";

export interface IWrapper {
  invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<TData>;
}

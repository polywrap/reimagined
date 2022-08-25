import { Result } from "@polywrap/result";

export interface IWrapInstance {
  instantiate<TArgs>(className: string, args: TArgs): Promise<Result<number, string>>;
  invokeInstance<TArgs, TData>(className: string, classInstancePtr: number, methodName: string, args: TArgs): Promise<Result<TData, string>>;
  invokeStatic<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<Result<TData, string>>;
}
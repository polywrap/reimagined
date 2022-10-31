export interface IWrapper {
  invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<TData>;
  invokeClassMethod<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<TData>;
}

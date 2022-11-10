
export interface IExternalReference {
  invokeClassMethod<TArgs, TReturnType>(methodName: string, args: TArgs): TReturnType;
}

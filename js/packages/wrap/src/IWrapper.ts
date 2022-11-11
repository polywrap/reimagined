import { IWrapInstance } from "./IWrapInstance";
export interface IWrapper extends IWrapInstance {
  invokeGlobalFunction<TArgs, TData>(funcName: string, args: TArgs): Promise<TData>;
  invokeClassMethod<TArgs, TData>(className: string, methodName: string, args: TArgs): Promise<TData>;
  invokeResource(resource: number, buffer: Uint8Array): Promise<Uint8Array>;
}

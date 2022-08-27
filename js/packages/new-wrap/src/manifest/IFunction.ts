import { IFunctionArg } from "./IFunctionArg";

export interface IFunction {
  name: string,
  args: IFunctionArg[],
  returnType: string
}

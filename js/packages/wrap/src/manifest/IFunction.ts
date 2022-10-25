import { IFunctionArg } from "./IFunctionArg";

export interface IFunction {
  type: "function",
  name: string,
  args: IFunctionArg[],
  returnType: string
}

import { IFunctionArg } from "./IFunctionArg";

export interface IMethod {
  type: "method",
  isInstance: boolean,
  className: string,
  name: string,
  args: IFunctionArg[],
  returnType: string
}

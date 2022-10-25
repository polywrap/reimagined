import { IWrapper } from "./IWrapper";

export type IWrapObjectReference = {
  readonly __referencePtr: number;
  readonly __wrapInstance: IWrapper;
}

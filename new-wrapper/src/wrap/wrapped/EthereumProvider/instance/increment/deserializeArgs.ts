import { IExternalInterface } from "../../../IExternalInterface/IExternalInterface";
import { IExternalInterfaceWrapped } from "../../../IExternalInterface/IExternalInterfaceWrapped";
import { Args } from "./args";

export function deserializeArgs(argsBuf: ArrayBuffer): IExternalInterface {
  return IExternalInterfaceWrapped.fromBuffer(argsBuf);
}
import { WrapModule } from "../wrap/WrapModule";
import { ExternalResource } from "./ExternalResource";

export function wrap_log(msg: string): void {
  const msgBuf = String.UTF8.encode(msg);
  WrapModule.wrapInstance.invokeResource(ExternalResource.Log, msgBuf);
}

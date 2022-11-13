import { IExternalWrapInstance, IInternalWrapInstance } from "@polywrap/reim-wrap-js";
import { invoke as invokeGlobalFunction } from "../../internal/global-functions/invokeGlobalFunction";
import { invokeClassMethod } from "../../internal/classes/invokeClassMethod";
import { InternalResource } from "../../dt/InternalResource";

export class InternalWrapInstance implements IInternalWrapInstance {
  invokeResource(resource: number, buffer: Uint8Array, externalWrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
    switch (resource) {
      case InternalResource.InvokeGlobalFunction:
        return invokeGlobalFunction(buffer, externalWrapInstance);
      case InternalResource.InvokeClassMethod: 
        return invokeClassMethod(buffer, externalWrapInstance);
      default:
        throw new Error("Unknown resource: " + resource.toString());
    }
  }
}

import { IExternalWrapInstance, IInternalWrapInstance } from "@nerfzael/reim-wrap-js";
import { invoke as invokeGlobalFunction } from "../../internal/global-functions/invokeGlobalFunction";
import { invokeClassMethod } from "../../internal/classes/invokeClassMethod";
import { InternalResource } from "../../dt/InternalResource";
import { ExternalResource } from "../../dt/ExternalResource";

export class InternalWrapInstance extends IInternalWrapInstance {
  constructor() {
    super();
  }

  invokeResource(resource: number, buffer: Uint8Array, externalWrapInstance: IExternalWrapInstance): Uint8Array {
    switch (resource) {
      case ExternalResource.InvokeGlobalFunction:
        return invokeGlobalFunction(buffer, externalWrapInstance);
      case InternalResource.InvokeClassMethod: 
        return invokeClassMethod(buffer, externalWrapInstance);
      default:
        throw new Error("Unknown resource");
    }
  }
}

import { IExternalWrapInstance, IInternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { invoke as invokeGlobalFunction } from "../../internal/global-functions/invokeGlobalFunction";
import { invokeClassMethod } from "../../internal/classes/invokeClassMethod";
import { InternalResource } from "../../dt/InternalResource";

export class InternalWrapInstance extends IInternalWrapInstance {
  constructor() {
    super();
  }

  invokeResource(resource: u32, buffer: ArrayBuffer, externalWrapInstance: IExternalWrapInstance): ArrayBuffer {
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

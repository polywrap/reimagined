import { concat, IExternalWrapInstance, u32ToBuffer } from "@nerfzael/reim-wrap-js";
import { send } from "../../dt";

export class HostWrapInstance extends IExternalWrapInstance {
  constructor() {
    super();
  }
  
  invokeResource(resource: number, buffer: Uint8Array): Uint8Array {
    const result = send(concat([u32ToBuffer(resource), buffer]));

    return result;
  }
}

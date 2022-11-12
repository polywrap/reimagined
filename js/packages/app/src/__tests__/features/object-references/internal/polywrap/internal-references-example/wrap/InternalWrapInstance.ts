import { IWrapInstance } from "@polywrap/reim-wrap";

export class InternalWrapInstance implements IWrapInstance {
  invokeResource(resource: number, buffer: Uint8Array): Promise<Uint8Array> {
    switch (resource) {
      default:
        throw new Error("Unknown resource");
    }
  }
}

export abstract class IExternalWrapInstance {
  abstract invokeResource(resource: u32, buffer: ArrayBuffer): ArrayBuffer;
}

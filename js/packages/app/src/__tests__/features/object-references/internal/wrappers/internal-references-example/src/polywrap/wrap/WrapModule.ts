import { ExternalWrapInstance, IWrapInstance } from "./WrapInstance";

export class WrapModule {
  static wrapInstance: IWrapInstance = new ExternalWrapInstance();

  static connect(instance: IWrapInstance): void {
    WrapModule.wrapInstance = instance;
  }

  static import(): void {
  }
}

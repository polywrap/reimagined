import { IWrapInstance } from "@polywrap/reim-wrap";
import { concat, u32ToBuffer } from "@polywrap/reim-wrap-dt";
import { WrapModule } from "../../../wrap/WrapModule";

export class TestInternalClassImport {
  constructor(private readonly wrapInstance: IWrapInstance) {
  }

  async create(arg: string): Promise<TestInternalClass> {
    const args = new CreateArgs(
      arg,
    );

    const buffer = concat(
        u32ToBuffer(WrapManifest.External.Classes.TestInternalClassMethod.Create),
        CreateArgsWrapped.serialize(args),
    );

    const result = await this.wrapInstance.invokeResource(HostResource.InvokeClassMethod, buffer);

    return TestExternalClassWrapped.deserialize(result);
  }

  testStaticMethod(arg: string): Promise<string> {
    const result = await wrapInstance.invokeInstanceMethod<TestInstanceMethodArgsWrapped, string>(
      WrapManifest.External.Class.TestExternalClass, 
      WrapManifest.External.Classes.TestExternalClassMethod.TestInstanceMethod, 
      this.__referencePtr,
      new TestInstanceMethodArgsWrapped(
        arg
      )
    );

    return result;
  }
}

export class TestInternalClass {
  constructor(private readonly __referencePtr: u32) {
  }

  static async create(arg: string): Promise<TestInternalClass> {
    return new TestInternalClassImport(WrapModule.wrapInstance)
      .create(
        arg
      );
  }

  async testInstanceMethod(arg: string): Promise<string> {
    return new TestInternalClassImport(WrapModule.wrapInstance)
      .testStaticMethod(
        arg
      );
  }
}

export const create = (instance: IWrapInstance) => {
  return new TestInternalClassImport(instance);
};

class CreateArgs {
  constructor(
    public arg: string,
  ) {
  }
}

class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: CreateArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        CreateArgsWrapped.mapToSerializable(value)
      )
    );
  }

  private static mapToSerializable(value: CreateArgs): CreateArgsWrapped {
    return new CreateArgsWrapped(
      value.arg,
    );
  }
}

import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';
import { TestInternalClassWrapped } from "../../wrapped";
import { TestInternalClass } from "../classes";



export function testReturnReference(
  arg: string,
): Promise<TestInternalClass> {
  return testReturnReferenceFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: string,
  ): Promise<TestInternalClass> => {
    return testReturnReferenceFromInstance(
      instance, 
      arg,
    );
  };
};

export const testReturnReferenceFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: string,
): Promise<TestInternalClass> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new TestReturnReferenceArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.TestReturnReference),
    TestReturnReferenceArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  return TestInternalClassWrapped.deserialize(result, instance);
  }

export class TestReturnReferenceArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestReturnReferenceArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestReturnReferenceArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestReturnReferenceArgs): TestReturnReferenceArgsWrapped {
    return new TestReturnReferenceArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class TestReturnReferenceArgs {
  constructor(
    public arg: string,
  ) {
  }
}

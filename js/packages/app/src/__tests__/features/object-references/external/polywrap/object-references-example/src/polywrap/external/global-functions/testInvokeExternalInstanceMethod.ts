import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';


export function testInvokeExternalInstanceMethod(
  arg: string,
): Promise<string> {
  return testInvokeExternalInstanceMethodFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: string,
  ): Promise<string> => {
    return testInvokeExternalInstanceMethodFromInstance(
      instance, 
      arg,
    );
  };
};

export const testInvokeExternalInstanceMethodFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: string,
): Promise<string> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new TestInvokeExternalInstanceMethodArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.TestInvokeExternalInstanceMethod),
    TestInvokeExternalInstanceMethodArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

export class TestInvokeExternalInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestInvokeExternalInstanceMethodArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestInvokeExternalInstanceMethodArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestInvokeExternalInstanceMethodArgs): TestInvokeExternalInstanceMethodArgsWrapped {
    return new TestInvokeExternalInstanceMethodArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class TestInvokeExternalInstanceMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

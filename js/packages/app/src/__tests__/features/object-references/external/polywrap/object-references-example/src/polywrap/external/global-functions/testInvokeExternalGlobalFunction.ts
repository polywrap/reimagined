import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';


export function testInvokeExternalGlobalFunction(
  arg: string,
): Promise<string> {
  return testInvokeExternalGlobalFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: string,
  ): Promise<string> => {
    return testInvokeExternalGlobalFunctionFromInstance(
      instance, 
      arg,
    );
  };
};

export const testInvokeExternalGlobalFunctionFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: string,
): Promise<string> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new TestInvokeExternalGlobalFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.TestInvokeExternalGlobalFunction),
    TestInvokeExternalGlobalFunctionArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

export class TestInvokeExternalGlobalFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestInvokeExternalGlobalFunctionArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestInvokeExternalGlobalFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestInvokeExternalGlobalFunctionArgs): TestInvokeExternalGlobalFunctionArgsWrapped {
    return new TestInvokeExternalGlobalFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class TestInvokeExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

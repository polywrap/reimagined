import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';


export function testInvokeExternalStaticMethod(
  arg: string,
): Promise<string> {
  return testInvokeExternalStaticMethodFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: string,
  ): Promise<string> => {
    return testInvokeExternalStaticMethodFromInstance(
      instance, 
      arg,
    );
  };
};

export const testInvokeExternalStaticMethodFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: string,
): Promise<string> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new TestInvokeExternalStaticMethodArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.TestInvokeExternalStaticMethod),
    TestInvokeExternalStaticMethodArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

export class TestInvokeExternalStaticMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestInvokeExternalStaticMethodArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestInvokeExternalStaticMethodArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestInvokeExternalStaticMethodArgs): TestInvokeExternalStaticMethodArgsWrapped {
    return new TestInvokeExternalStaticMethodArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class TestInvokeExternalStaticMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

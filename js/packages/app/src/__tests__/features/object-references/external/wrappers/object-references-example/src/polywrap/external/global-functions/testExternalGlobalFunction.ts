import { stringify } from '@serial-as/json'
import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@nerfzael/reim-wrap-as';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';


export function testExternalGlobalFunction(
  arg: string,
): string {
  return testExternalGlobalFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

//export const create = (instance: IExternalWrapInstance) => {
//  return (
//    
//    arg: string,
//    
//  ): string => {
//    return testExternalGlobalFunctionFromInstance(
//      instance, 
//      
//      arg,
//      
//    );
//  };
//};

export const testExternalGlobalFunctionFromInstance = (
  instance: IExternalWrapInstance | null, 
  arg: string,
): string => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new TestExternalGlobalFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.TestExternalGlobalFunction),
    TestExternalGlobalFunctionArgsWrapped.serialize(args),
  ]);

  const result = instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

@serializable
export class TestExternalGlobalFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestExternalGlobalFunctionArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestExternalGlobalFunctionArgsWrapped>(
        TestExternalGlobalFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestExternalGlobalFunctionArgs): TestExternalGlobalFunctionArgsWrapped {
    return new TestExternalGlobalFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class TestExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

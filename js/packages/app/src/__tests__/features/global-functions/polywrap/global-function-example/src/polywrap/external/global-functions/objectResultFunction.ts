import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';

import { TestObject } from "../../..";


export function objectResultFunction(
  arg: TestObject,
): Promise<TestObject> {
  return objectResultFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: TestObject,
  ): Promise<TestObject> => {
    return objectResultFunctionFromInstance(
      instance, 
      arg,
    );
  };
};

export const objectResultFunctionFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: TestObject,
): Promise<TestObject> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new ObjectResultFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.ObjectResultFunction),
    ObjectResultFunctionArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<TestObject>(result);
}

export class ObjectResultFunctionArgsWrapped {
  constructor(
    public arg: TestObject,
  ) {
  }

  static serialize(value: ObjectResultFunctionArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        ObjectResultFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: ObjectResultFunctionArgs): ObjectResultFunctionArgsWrapped {
    return new ObjectResultFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class ObjectResultFunctionArgs {
  constructor(
    public arg: TestObject,
  ) {
  }
}

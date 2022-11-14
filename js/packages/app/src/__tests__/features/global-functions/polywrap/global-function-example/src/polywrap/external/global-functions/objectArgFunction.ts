import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';

import { TestObject } from "../../..";


export function objectArgFunction(
  arg: TestObject,
): Promise<string> {
  return objectArgFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: TestObject,
  ): Promise<string> => {
    return objectArgFunctionFromInstance(
      instance, 
      arg,
    );
  };
};

export const objectArgFunctionFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: TestObject,
): Promise<string> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new ObjectArgFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.ObjectArgFunction),
    ObjectArgFunctionArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

export class ObjectArgFunctionArgsWrapped {
  constructor(
    public arg: TestObject,
  ) {
  }

  static serialize(value: ObjectArgFunctionArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        ObjectArgFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: ObjectArgFunctionArgs): ObjectArgFunctionArgsWrapped {
    return new ObjectArgFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class ObjectArgFunctionArgs {
  constructor(
    public arg: TestObject,
  ) {
  }
}

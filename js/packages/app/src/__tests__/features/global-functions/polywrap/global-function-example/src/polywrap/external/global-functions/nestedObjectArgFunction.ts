import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';

import { ObjectWithChildren } from "../../..";


export function nestedObjectArgFunction(
  arg: ObjectWithChildren,
): Promise<string> {
  return nestedObjectArgFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: ObjectWithChildren,
  ): Promise<string> => {
    return nestedObjectArgFunctionFromInstance(
      instance, 
      arg,
    );
  };
};

export const nestedObjectArgFunctionFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: ObjectWithChildren,
): Promise<string> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new NestedObjectArgFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.NestedObjectArgFunction),
    NestedObjectArgFunctionArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

export class NestedObjectArgFunctionArgsWrapped {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }

  static serialize(value: NestedObjectArgFunctionArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        NestedObjectArgFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: NestedObjectArgFunctionArgs): NestedObjectArgFunctionArgsWrapped {
    return new NestedObjectArgFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class NestedObjectArgFunctionArgs {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }
}

import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';

import { ObjectWithChildren } from "../../..";


export function nestedObjectResultFunction(
  arg: ObjectWithChildren,
): Promise<ObjectWithChildren> {
  return nestedObjectResultFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: ObjectWithChildren,
  ): Promise<ObjectWithChildren> => {
    return nestedObjectResultFunctionFromInstance(
      instance, 
      arg,
    );
  };
};

export const nestedObjectResultFunctionFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: ObjectWithChildren,
): Promise<ObjectWithChildren> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new NestedObjectResultFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.NestedObjectResultFunction),
    NestedObjectResultFunctionArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<ObjectWithChildren>(result);
}

export class NestedObjectResultFunctionArgsWrapped {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }

  static serialize(value: NestedObjectResultFunctionArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        NestedObjectResultFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: NestedObjectResultFunctionArgs): NestedObjectResultFunctionArgsWrapped {
    return new NestedObjectResultFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class NestedObjectResultFunctionArgs {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }
}

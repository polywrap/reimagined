import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';


export function stringArgFunction(
  arg: string,
): Promise<string> {
  return stringArgFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: string,
  ): Promise<string> => {
    return stringArgFunctionFromInstance(
      instance, 
      arg,
    );
  };
};

export const stringArgFunctionFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: string,
): Promise<string> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new StringArgFunctionArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.StringArgFunction),
    StringArgFunctionArgsWrapped.serialize(args),
  ]);

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

export class StringArgFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: StringArgFunctionArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        StringArgFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: StringArgFunctionArgs): StringArgFunctionArgsWrapped {
    return new StringArgFunctionArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class StringArgFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

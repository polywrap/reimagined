import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { SomeExternalWrapped } from "..";

import { SomeExternal } from "../../..";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    case WrapManifest.Internal.Classes.SomeExternalMethod.Create:
        return invokeCreateWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.SomeExternalMethod.GetValue:
        return invokeGetValueWrapped(dataBuffer, wrapInstance);
    default:
      throw new Error(`Unknown method: ${funcId.toString()} on class `);
  }
}

const invokeCreateWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = SomeExternal.create(
  );
  
  return SomeExternalWrapped.serialize(result);
  };

class CreateArgs {
  constructor(
  ) {
  }
}

class CreateArgsWrapped {
  constructor(
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): CreateArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new CreateArgs(

    );
  }  
}
const invokeGetValueWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  
  const referencePtr = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  const args = GetValueArgsWrapped.deserialize(dataBuffer, wrapInstance);

  const object = SomeExternalWrapped.dereference(referencePtr);

  const result = object.getValue(
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class GetValueArgs {
  constructor(
  ) {
  }
}

class GetValueArgsWrapped {
  constructor(
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): GetValueArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new GetValueArgs(

    );
  }  
}

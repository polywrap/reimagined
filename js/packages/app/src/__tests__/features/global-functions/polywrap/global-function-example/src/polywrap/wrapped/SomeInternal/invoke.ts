import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { SomeInternalWrapped } from "..";
import { SomeInternal } from "../../external/classes";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    case WrapManifest.Internal.Classes.SomeInternalMethod.Create:
        return invokeCreateWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.SomeInternalMethod.GetValue:
        return invokeGetValueWrapped(dataBuffer, wrapInstance);
    default:
      throw new Error(`Unknown method: ${funcId.toString()} on class `);
  }
}

const invokeCreateWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = SomeInternal.create(
  );
  
  return SomeInternalWrapped.serialize(result);
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

  const object = SomeInternalWrapped.dereference(referencePtr);

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

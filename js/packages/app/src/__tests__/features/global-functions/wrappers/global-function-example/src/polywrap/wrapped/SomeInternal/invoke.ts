import { parse } from '@serial-as/json'
import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { SomeInternalWrapped } from "..";

import { SomeInternal } from "../../..";



export function invoke(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
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

const invokeCreateWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
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

@serializable
class CreateArgsWrapped {
  constructor(
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): CreateArgs {
    const args = parse<CreateArgsWrapped>(String.UTF8.decode(buffer));
  
    return new CreateArgs(

    );
  }  
}
const invokeGetValueWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  
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

@serializable
class GetValueArgsWrapped {
  constructor(
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): GetValueArgs {
    const args = parse<GetValueArgsWrapped>(String.UTF8.decode(buffer));
  
    return new GetValueArgs(

    );
  }  
}

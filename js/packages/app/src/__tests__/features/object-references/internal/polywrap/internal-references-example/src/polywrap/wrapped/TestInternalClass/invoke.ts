import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { TestInternalClassWrapped } from "..";
import { TestInternalClass } from "../../external/classes";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    case WrapManifest.Internal.Classes.TestInternalClassMethod.Create:
        return invokeCreateWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestInternalClassMethod.TestInstanceMethod:
        return invokeTestInstanceMethodWrapped(dataBuffer, wrapInstance);
    default:
      throw new Error(`Unknown method: ${funcId.toString()} on class `);
  }
}

const invokeCreateWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = TestInternalClass.create(
    args.arg,
  );
  
  return TestInternalClassWrapped.serialize(result);
  };

class CreateArgs {
  constructor(
    public arg: string,
  ) {
  }
}

class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): CreateArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new CreateArgs(
            
      args.arg,
      
    );
  }  
}
const invokeTestInstanceMethodWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  
  const referencePtr = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  const args = TestInstanceMethodArgsWrapped.deserialize(dataBuffer, wrapInstance);

  const object = TestInternalClassWrapped.dereference(referencePtr);

  const result = object.testInstanceMethod(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestInstanceMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

class TestInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestInstanceMethodArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new TestInstanceMethodArgs(
            
      args.arg,
      
    );
  }  
}

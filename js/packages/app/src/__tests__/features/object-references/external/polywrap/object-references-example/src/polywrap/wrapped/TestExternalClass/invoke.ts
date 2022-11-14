import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { TestExternalClassWrapped } from "..";

import { TestExternalClass } from "../../..";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    case WrapManifest.Internal.Classes.TestExternalClassMethod.Create:
        return invokeCreateWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestExternalClassMethod.TestInstanceMethod:
        return invokeTestInstanceMethodWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestExternalClassMethod.TestStaticMethod:
        return invokeTestStaticMethodWrapped(dataBuffer, wrapInstance);
    default:
      throw new Error(`Unknown method: ${funcId.toString()} on class `);
  }
}

const invokeCreateWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = await TestExternalClass.create(
    args.arg,
  );
  
  return TestExternalClassWrapped.serialize(result);
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
const invokeTestInstanceMethodWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  
  const referencePtr = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  const args = TestInstanceMethodArgsWrapped.deserialize(dataBuffer, wrapInstance);

  const object = TestExternalClassWrapped.dereference(referencePtr);

  const result = await object.testInstanceMethod(
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
const invokeTestStaticMethodWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = TestStaticMethodArgsWrapped.deserialize(buffer, wrapInstance);

  const result = await TestExternalClass.testStaticMethod(
    args.arg,
  );
  
  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestStaticMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

class TestStaticMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestStaticMethodArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new TestStaticMethodArgs(
            
      args.arg,
      
    );
  }  
}

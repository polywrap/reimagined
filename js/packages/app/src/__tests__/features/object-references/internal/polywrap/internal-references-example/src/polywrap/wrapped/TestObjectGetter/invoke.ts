import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { TestInternalClassWrapped } from "..";
import { TestInternalClass } from "../../external/classes";

import { TestObjectGetterWrapped } from "..";
import { TestObjectGetter } from "../../external/classes";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.Create:
        return invokeCreateWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.TestInstanceMethod:
        return invokeTestInstanceMethodWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.TestStaticMethod:
        return invokeTestStaticMethodWrapped(dataBuffer, wrapInstance);
    default:
      throw new Error(`Unknown method: ${funcId.toString()} on class `);
  }
}

const invokeCreateWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = TestObjectGetter.create(
    args.arg,
  );
  
  return TestObjectGetterWrapped.serialize(result);
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

  const object = TestObjectGetterWrapped.dereference(referencePtr);

  const result = object.testInstanceMethod(
    args.arg,
  );

  return TestInternalClassWrapped.serialize(result);
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
const invokeTestStaticMethodWrapped = (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = TestStaticMethodArgsWrapped.deserialize(buffer, wrapInstance);

  const result = TestObjectGetter.testStaticMethod(
    args.arg,
  );
  
  return TestInternalClassWrapped.serialize(result);
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

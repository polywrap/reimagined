import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { TestObjectGetterWrapped } from "..";
import { TestObjectGetter } from "../../external/classes";

import { TestExternalClassWrapped } from "..";

import { TestExternalClass } from "../../..";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.Create:
        return invokeCreateWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.TestInstanceReceiveReference:
        return invokeTestInstanceReceiveReferenceWrapped(dataBuffer, wrapInstance);
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.TestStaticReceiveReference:
        return invokeTestStaticReceiveReferenceWrapped(dataBuffer, wrapInstance);
    default:
      throw new Error(`Unknown method: ${funcId.toString()} on class `);
  }
}

const invokeCreateWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = await TestObjectGetter.create(
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
const invokeTestInstanceReceiveReferenceWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  
  const referencePtr = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  const args = TestInstanceReceiveReferenceArgsWrapped.deserialize(dataBuffer, wrapInstance);

  const object = TestObjectGetterWrapped.dereference(referencePtr);

  const result = await object.testInstanceReceiveReference(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestInstanceReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

class TestInstanceReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestInstanceReceiveReferenceArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new TestInstanceReceiveReferenceArgs(
      
      TestExternalClassWrapped.mapFromSerializable(args.arg, wrapInstance),
            
    );
  }  
}
const invokeTestStaticReceiveReferenceWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const args = TestStaticReceiveReferenceArgsWrapped.deserialize(buffer, wrapInstance);

  const result = await TestObjectGetter.testStaticReceiveReference(
    args.arg,
  );
  
  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestStaticReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

class TestStaticReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestStaticReceiveReferenceArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new TestStaticReceiveReferenceArgs(
      
      TestExternalClassWrapped.mapFromSerializable(args.arg, wrapInstance),
            
    );
  }  
}

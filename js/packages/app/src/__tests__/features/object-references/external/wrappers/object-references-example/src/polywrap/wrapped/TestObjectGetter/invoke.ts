import { parse } from '@serial-as/json'
import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { TestExternalClassWrapped } from "..";
import { TestExternalClass } from "../../external/classes";

import { TestObjectGetterWrapped } from "..";

import { TestObjectGetter } from "../../..";



export function invoke(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
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

const invokeCreateWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
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

@serializable
class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): CreateArgs {
    const args = parse<CreateArgsWrapped>(String.UTF8.decode(buffer));
  
    return new CreateArgs(
            
      args.arg,
      
    );
  }  
}
const invokeTestInstanceReceiveReferenceWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  
  const referencePtr = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  const args = TestInstanceReceiveReferenceArgsWrapped.deserialize(dataBuffer, wrapInstance);

  const object = TestObjectGetterWrapped.dereference(referencePtr);

  const result = object.testInstanceReceiveReference(
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

@serializable
class TestInstanceReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestInstanceReceiveReferenceArgs {
    const args = parse<TestInstanceReceiveReferenceArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestInstanceReceiveReferenceArgs(
      
      TestExternalClassWrapped.mapFromSerializable(args.arg, wrapInstance),
            
    );
  }  
}
const invokeTestStaticReceiveReferenceWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const args = TestStaticReceiveReferenceArgsWrapped.deserialize(buffer, wrapInstance);

  const result = TestObjectGetter.testStaticReceiveReference(
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

@serializable
class TestStaticReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestStaticReceiveReferenceArgs {
    const args = parse<TestStaticReceiveReferenceArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestStaticReceiveReferenceArgs(
      
      TestExternalClassWrapped.mapFromSerializable(args.arg, wrapInstance),
            
    );
  }  
}

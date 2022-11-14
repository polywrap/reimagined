import { parse } from '@serial-as/json'
import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { TestExternalClassWrapped } from "..";
import { TestExternalClass } from "../../external/classes";



export function invoke(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
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

const invokeCreateWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const args = CreateArgsWrapped.deserialize(buffer, wrapInstance);

  const result = TestExternalClass.create(
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
const invokeTestInstanceMethodWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  
  const referencePtr = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  const args = TestInstanceMethodArgsWrapped.deserialize(dataBuffer, wrapInstance);

  const object = TestExternalClassWrapped.dereference(referencePtr);

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

@serializable
class TestInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestInstanceMethodArgs {
    const args = parse<TestInstanceMethodArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestInstanceMethodArgs(
            
      args.arg,
      
    );
  }  
}
const invokeTestStaticMethodWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const args = TestStaticMethodArgsWrapped.deserialize(buffer, wrapInstance);

  const result = TestExternalClass.testStaticMethod(
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

@serializable
class TestStaticMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestStaticMethodArgs {
    const args = parse<TestStaticMethodArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestStaticMethodArgs(
            
      args.arg,
      
    );
  }  
}

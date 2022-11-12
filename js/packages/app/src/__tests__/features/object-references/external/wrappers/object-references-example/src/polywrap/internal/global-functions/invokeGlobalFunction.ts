import { parse } from '@serial-as/json'
import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { 
  
  testReceiveReference,
    
  testInvokeExternalGlobalFunction,
    
  testInvokeExternalStaticMethod,
    
  testInvokeExternalInstanceMethod,
       
} from "../../..";
import { TestExternalClassWrapped } from "../../wrapped";
import { TestExternalClass } from "../../external";



export function invoke(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    
    case WrapManifest.Internal.GlobalFunction.TestReceiveReference:
        return invokeTestReceiveReferenceWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.TestInvokeExternalGlobalFunction:
        return invokeTestInvokeExternalGlobalFunctionWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.TestInvokeExternalStaticMethod:
        return invokeTestInvokeExternalStaticMethodWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.TestInvokeExternalInstanceMethod:
        return invokeTestInvokeExternalInstanceMethodWrapped(dataBuffer, wrapInstance);
            
    default:
      throw new Error("Unknown function/method: " + funcId.toString());
  }
}

const invokeTestReceiveReferenceWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = TestReceiveReferenceArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = testReceiveReference(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

@serializable
class TestReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestReceiveReferenceArgs {
    const args = parse<TestReceiveReferenceArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestReceiveReferenceArgs(
      
      TestExternalClassWrapped.mapFromSerializable(args.arg, wrapInstance),
            
    );
  }  
}
const invokeTestInvokeExternalGlobalFunctionWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = TestInvokeExternalGlobalFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = testInvokeExternalGlobalFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestInvokeExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
class TestInvokeExternalGlobalFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestInvokeExternalGlobalFunctionArgs {
    const args = parse<TestInvokeExternalGlobalFunctionArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestInvokeExternalGlobalFunctionArgs(
            
      args.arg,
      
    );
  }  
}
const invokeTestInvokeExternalStaticMethodWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = TestInvokeExternalStaticMethodArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = testInvokeExternalStaticMethod(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestInvokeExternalStaticMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
class TestInvokeExternalStaticMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestInvokeExternalStaticMethodArgs {
    const args = parse<TestInvokeExternalStaticMethodArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestInvokeExternalStaticMethodArgs(
            
      args.arg,
      
    );
  }  
}
const invokeTestInvokeExternalInstanceMethodWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = TestInvokeExternalInstanceMethodArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = testInvokeExternalInstanceMethod(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestInvokeExternalInstanceMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
class TestInvokeExternalInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestInvokeExternalInstanceMethodArgs {
    const args = parse<TestInvokeExternalInstanceMethodArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestInvokeExternalInstanceMethodArgs(
            
      args.arg,
      
    );
  }  
}


import { parse } from '@serial-as/json'
import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { 
  
  testReturnReference,
   
} from "../../..";
import { TestInternalClassWrapped } from "../../wrapped";

import { TestInternalClass } from "../../..";



export function invoke(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    
    case WrapManifest.Internal.GlobalFunction.TestReturnReference:
        return invokeTestReturnReferenceWrapped(dataBuffer, wrapInstance);
    
    default:
      throw new Error("Unknown function/method: " + funcId.toString());
  }
}

const invokeTestReturnReferenceWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = TestReturnReferenceArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = testReturnReference(
    args.arg,
  );

  return TestInternalClassWrapped.serialize(result);
  };

class TestReturnReferenceArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
class TestReturnReferenceArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): TestReturnReferenceArgs {
    const args = parse<TestReturnReferenceArgsWrapped>(String.UTF8.decode(buffer));
  
    return new TestReturnReferenceArgs(
            
      args.arg,
      
    );
  }  
}


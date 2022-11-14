import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { 
                  
  testExternalGlobalFunction,
   
} from "../../..";
import { TestExternalClassWrapped } from "../../wrapped";

import { TestExternalClass } from "../../..";



export function invoke(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
                                    
    case WrapManifest.Internal.GlobalFunction.TestExternalGlobalFunction:
        return invokeTestExternalGlobalFunctionWrapped(dataBuffer, wrapInstance);
    
    default:
      throw new Error("Unknown function/method: " + funcId.toString());
  }
}

const invokeTestExternalGlobalFunctionWrapped = async (buffer: Uint8Array, wrapInstance: IExternalWrapInstance): Promise<Uint8Array> => {
  const argsBuffer = buffer;

  const args = TestExternalGlobalFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = await testExternalGlobalFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class TestExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

class TestExternalGlobalFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: Uint8Array, wrapInstance: IExternalWrapInstance): TestExternalGlobalFunctionArgs {
    const args = JSON.parse(new TextDecoder().decode(buffer));
  
    return new TestExternalGlobalFunctionArgs(
            
      args.arg,
      
    );
  }  
}


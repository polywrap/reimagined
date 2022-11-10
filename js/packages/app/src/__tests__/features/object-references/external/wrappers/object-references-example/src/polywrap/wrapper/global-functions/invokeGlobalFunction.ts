import { testReceiveReference } from "../../..";
import { bufferToU32 } from "../../buffer";
import { BaseTypeSerialization } from "../../serialization/BaseTypeSerialization";
import { wrap_log } from "../../wrap/host-resources/wrap_log";
import { 
  testInvokeExternalGlobalFunctionWrapped,
  testInvokeExternalStaticMethodWrapped,
  testInvokeExternalInstanceMethodWrapped,
} from "./list";

export function invokeGlobalFunction(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  wrap_log("invokeGlobalFunction: " + func.toString());

  switch (func) {
    case WrapManifest.Internal.GlobalFunction.TestReceiveReference:
      const args = TestReceiveReferenceArgsWrapped.deserialize(dataBuffer);

      const result = testReceiveReference(
        args.arg
      );
    
      return BaseTypeSerialization.serialize<String>(result);
    case WrapManifest.Internal.GlobalFunction.TestInvokeExternalGlobalFunction:
      return testInvokeExternalGlobalFunctionWrapped(dataBuffer);
    case WrapManifest.Internal.GlobalFunction.TestInvokeExternalStaticMethod:
      return testInvokeExternalStaticMethodWrapped(dataBuffer);
    case WrapManifest.Internal.GlobalFunction.TestInvokeExternalInstanceMethod:
      return testInvokeExternalInstanceMethodWrapped(dataBuffer);
    default:
      throw new Error("Unknown function");
  }
}

@serializable
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

  static deserialize(buffer: ArrayBuffer): Args {
    const args = parse<ArgsWrapped>(String.UTF8.decode(buffer));
  
    return new Args(
      new TestExternalClass(args.arg.__referencePtr),
    );
  }
}

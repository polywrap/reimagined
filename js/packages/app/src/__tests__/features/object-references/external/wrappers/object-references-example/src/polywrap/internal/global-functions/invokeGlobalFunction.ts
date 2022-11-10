import { testReceiveReference } from "../../..";
import { bufferToU32 } from "../../buffer";
import { BaseTypeSerialization } from "../../serialization/BaseTypeSerialization";

export function invoke(buffer: ArrayBuffer): ArrayBuffer {
  const func = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (func) {
    case WrapManifest.Internal.GlobalFunction.TestReceiveReference:
      return invokeTestReceiveReference(dataBuffer);
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

const invokeTestReceiveReference = (buffer: ArrayBuffer): ArrayBuffer => {
  const args = TestReceiveReferenceArgsWrapped.deserialize(buffer);

  const result = testReceiveReference(
    args.arg
  );

  return BaseTypeSerialization.serialize<String>(result);
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

  static deserialize(buffer: ArrayBuffer): Args {
    const args = parse<ArgsWrapped>(String.UTF8.decode(buffer));
  
    return new Args(
      new TestExternalClass(args.arg.__referencePtr),
    );
  }
}

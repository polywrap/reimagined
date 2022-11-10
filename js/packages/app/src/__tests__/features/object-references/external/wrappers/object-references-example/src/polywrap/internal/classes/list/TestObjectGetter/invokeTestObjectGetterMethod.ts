import { parse } from "@serial-as/json";
import { bufferToU32 } from "../../../../buffer";

export function invoke(buffer: ArrayBuffer): ArrayBuffer {  
  const method = bufferToU32(buffer, 4);
  const dataBuffer = buffer.slice(4);
  
  switch (method) {
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.Create:
      return invokeCreate(dataBuffer); 
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.TestInstanceReceiveReference:
      return testInstanceReceiveReferenceWrapped(dataBuffer);
    case WrapManifest.Internal.Classes.TestObjectGetterMethod.TestStaticReceiveReference:
      return testStaticReceiveReferenceWrapped(dataBuffer);
    default:
      throw new Error("Unknown method " + method.toString());
  }
}

const invokeTestReceiveReference = (buffer: ArrayBuffer): ArrayBuffer => {
  const args = CreateArgsWrapped.deserialize(buffer);

  const result = TestObjectGetter.create(args.arg);

  return TestObjectGetterWrapped.serialize(result);
}

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

  static deserialize(buffer: ArrayBuffer): CreateArgs {
    const args = parse<CreateArgsWrapped>(String.UTF8.decode(buffer));
  
    return new CreateArgs(
      args.arg,
    );
  }
}

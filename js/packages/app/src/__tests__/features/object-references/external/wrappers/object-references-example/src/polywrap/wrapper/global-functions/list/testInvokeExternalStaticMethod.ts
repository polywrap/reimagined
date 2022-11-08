import { parse } from "@serial-as/json";
import { testInvokeExternalStaticMethod } from "../../../..";
import { BaseTypeSerialization } from "../../../serialization/BaseTypeSerialization";

export function testInvokeExternalStaticMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = testInvokeExternalStaticMethod(
    args.arg
  );

  return BaseTypeSerialization.serialize<String>(result);
}

@serializable
class Args {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer): Args {
    const args = parse<SerializedArgs>(String.UTF8.decode(buffer));
  
    return new Args(
      args.arg,
    );
  }
}

@serializable
class SerializedArgs {
  constructor(
    public arg: string,
  ) {
  }
}

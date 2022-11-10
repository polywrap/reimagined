import { testInvokeExternalGlobalFunction } from "../../../..";
import { BaseTypeSerialization } from "../../../serialization/BaseTypeSerialization";
import { parse } from "@serial-as/json";

export function testInvokeExternalGlobalFunctionWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = testInvokeExternalGlobalFunction(
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

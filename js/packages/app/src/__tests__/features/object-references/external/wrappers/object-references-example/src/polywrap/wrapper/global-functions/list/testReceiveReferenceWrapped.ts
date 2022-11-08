import { parse } from "@serial-as/json";
import { testReceiveReference } from "../../../..";
import { TestExternalClass, TestExternalClassWrapped } from "../../../host";
import { BaseTypeSerialization } from "../../../serialization/BaseTypeSerialization";

export function testReceiveReferenceWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = testReceiveReference(
    args.arg
  );

  return BaseTypeSerialization.serialize<String>(result);
}

@serializable
class Args {
  constructor(
    public arg: TestExternalClass,
  ) {
  }

  static deserialize(buffer: ArrayBuffer): Args {
    const args = parse<SerializedArgs>(String.UTF8.decode(buffer));
  
    return new Args(
      new TestExternalClass(args.arg.__referencePtr),
    );
  }
}

@serializable
class SerializedArgs {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }
}

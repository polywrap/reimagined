import { parse } from "@serial-as/json";
import { testReceiveReference } from "../../../..";
import { TestExternalClass } from "../../../external";
import { TestExternalClassWrapped } from "../../../wrapped";
import { BaseTypeSerialization } from "../../../serialization/BaseTypeSerialization";

export function testReceiveReferenceWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = ArgsWrapped.deserialize(dataBuffer);

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
}

@serializable
class ArgsWrapped {
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

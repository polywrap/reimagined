import { parse } from "@serial-as/json";
import { BaseTypeSerialization } from "../../../../../serialization/BaseTypeSerialization";
import { TestInternalClassWrapped } from "../TestInternalClassWrapped";

export function testInstanceMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = InstanceReferenceWithArgs.deserialize(dataBuffer);

  const object = TestInternalClassWrapped.findReference(args.referencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return BaseTypeSerialization.serialize<String>(result);
}

@serializable
export class InstanceReferenceWithArgs {
  constructor(
    public referencePtr: u32,
    public args: Args
  ) {}

  static deserialize(buffer: ArrayBuffer): InstanceReferenceWithArgs {
    return parse<InstanceReferenceWithArgs>(String.UTF8.decode(buffer));
  }
}

@serializable
export class Args {
  constructor(
    public arg: string
  ) {}
}

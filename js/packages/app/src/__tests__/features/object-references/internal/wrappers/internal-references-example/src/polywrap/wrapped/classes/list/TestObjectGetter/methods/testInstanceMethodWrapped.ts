import { parse } from "@serial-as/json";
import { TestObjectGetter } from "../../../../../..";
import { TestInternalClassWrapped } from "../../TestInternalClass/TestInternalClassWrapped";

export function testInstanceMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = InstanceReferenceWithArgs.deserialize(dataBuffer);

  const object = changetype<TestObjectGetter>(args.referencePtr);

  const result = object.testInstanceMethod(args.args.arg);

  return TestInternalClassWrapped.serialize(result);
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

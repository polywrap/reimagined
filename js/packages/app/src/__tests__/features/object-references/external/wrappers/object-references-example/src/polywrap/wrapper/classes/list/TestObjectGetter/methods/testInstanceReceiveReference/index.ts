import { parse } from "@serial-as/json";
import { TestObjectGetter } from "../../../../../../..";
import { TestExternalClass, TestExternalClassWrapped } from "../../../../../../host";
import { serializeResult } from "./serializeResult";

export function testInstanceReceiveReferenceWrapped(buffer: ArrayBuffer): ArrayBuffer {
  const args = SerializedInstanceReferenceWithArgs.deserialize(buffer);

  const object = changetype<TestObjectGetter>(args.referencePtr);

  const result = object.testInstanceReceiveReference(args.args.arg);

  return serializeResult(result);
}

@serializable
class SerializedInstanceReferenceWithArgs {
  constructor(
    public referencePtr: u32,
    public args: SerializedArgs,
  ) {
  }

  static deserialize(buffer: ArrayBuffer): InstanceReferenceWithArgs {
    const args = parse<SerializedInstanceReferenceWithArgs>(String.UTF8.decode(buffer));
  
    return new InstanceReferenceWithArgs(
      args.referencePtr,
      new Args(
        new TestExternalClass(
          args.args.arg.__referencePtr
        ),
      )
    );
  }
}

@serializable
class InstanceReferenceWithArgs {
  constructor(
    public referencePtr: u32,
    public args: Args,
  ) {
  }
}

@serializable
class Args {
  constructor(
    public arg: TestExternalClass
  ) {
  }
}

@serializable
class SerializedArgs {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }
}

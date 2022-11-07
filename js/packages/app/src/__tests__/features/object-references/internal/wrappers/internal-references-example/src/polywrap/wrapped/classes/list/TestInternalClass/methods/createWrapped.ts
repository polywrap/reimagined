import { parse } from '@serial-as/json'
import { TestInternalClass } from "../../../../../..";
import { TestInternalClassWrapped } from "../TestInternalClassWrapped";

export function createWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = TestInternalClass.create(args.arg);

  return TestInternalClassWrapped.serialize(result);
}

@serializable
export class Args {
  constructor(
    public arg: string,
  ) {}

  static deserialize(buffer: ArrayBuffer): Args {
    return parse<Args>(String.UTF8.decode(buffer));
  }
}

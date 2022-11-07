
import { parse } from '@serial-as/json'
import { testReturnReference } from "../../../..";
import { TestInternalClassWrapped } from "../../classes/list/TestInternalClass/TestInternalClassWrapped";

export function testReturnReferenceWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = testReturnReference(
    args.arg
  );

  return TestInternalClassWrapped.serialize(result);
}

@serializable
export class Args {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer): Args {
    return parse<Args>(String.UTF8.decode(buffer));
  }  
}

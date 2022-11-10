import { TestExternalClass } from "../../../../../../external/classes/TestExternalClass";
import { TestExternalClassWrapped } from "../../../../../../wrapped/TestExternalClassWrapped";

@serializable
export class SerializedArgs {
  constructor(
    public arg: TestExternalClassWrapped
  ) {}
}
@serializable
export class Args {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

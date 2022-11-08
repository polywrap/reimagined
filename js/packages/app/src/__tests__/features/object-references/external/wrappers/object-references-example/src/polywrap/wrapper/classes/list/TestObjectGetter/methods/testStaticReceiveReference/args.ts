import { TestExternalClassWrapped, TestExternalClass } from "../../../../../../host/classes/TestExternalClass";

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

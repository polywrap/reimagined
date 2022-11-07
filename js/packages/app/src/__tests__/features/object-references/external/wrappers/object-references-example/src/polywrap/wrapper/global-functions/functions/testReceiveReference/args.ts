import { TestExternalClass, TestExternalClassWrapped } from "../../../../host/TestExternalClass";

@serializable
export class Args {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

@serializable
export class SerializedArgs {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }
}

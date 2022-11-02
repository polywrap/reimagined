import { TestExternalClass, TestExternalClassWrapped } from "../../../types/TestExternalClass";

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

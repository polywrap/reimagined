import { TestExternalClassWrapped, TestExternalClass } from "../../../../../types/TestExternalClass";

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

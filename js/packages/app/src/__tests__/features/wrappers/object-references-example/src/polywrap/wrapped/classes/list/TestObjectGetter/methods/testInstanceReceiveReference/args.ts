import { TestExternalClassWrapped, TestExternalClass } from "../../../../../types/TestExternalClass";

@serializable
export class InstanceInfo {
  constructor(
    public objectReferencePtr: u32,
    public args: SerializedArgs
  ) {}
}

@serializable
export class SerializedArgs {
  constructor(
    public arg: TestExternalClassWrapped
  ) {}
}

@serializable
export class MethodArgs {
  constructor(
    public objectReferencePtr: u32,
    public args: Args,
  ) {
  }
}

@serializable
export class Args {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

import { TestObject } from "../../../types/TestObject";

@serializable
export class Args {
  constructor(
    public arg: TestObject,
  ) {}
}

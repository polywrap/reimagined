import { ObjectWithChildren } from "../../../types/ObjectWithChildren";

@serializable
export class Args {
  constructor(
    public arg: ObjectWithChildren,
  ) {}
}

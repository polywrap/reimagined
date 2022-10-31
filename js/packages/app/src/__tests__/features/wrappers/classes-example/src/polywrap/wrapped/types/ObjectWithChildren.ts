import { TestObject } from "./TestObject";
import { TestObject2 } from "./TestObject2";

@serializable
export class ObjectWithChildren {
  obj1: TestObject;
  obj2: TestObject2;
}

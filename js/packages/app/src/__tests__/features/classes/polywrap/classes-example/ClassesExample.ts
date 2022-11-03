import { IWrapper } from "@polywrap/reim-wrap";
import { create as createTestClass } from "./internal-types/TestClass";

export class ClassesExample {
  static from(wrapper: IWrapper) {
    return {
      TestClass: createTestClass(wrapper),
    };
  }
}

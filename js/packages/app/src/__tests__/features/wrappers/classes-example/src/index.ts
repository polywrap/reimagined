import { wrap_log } from "./polywrap/wrap/host-resources/wrap_log";
import { ObjectWithChildren } from "./polywrap/wrapped/types/ObjectWithChildren";
import { TestObject } from "./polywrap/wrapped/types/TestObject";
import { ITestClass } from "./polywrap/wrapped/classes/list/TestClass/ITestClass";

export function stringArgFunction(arg: string): string {
    return arg;
}

export function objectArgFunction(arg: TestObject): string {
  return arg.str + " " + arg.num.toString();
}

export function objectResultFunction(arg: TestObject): TestObject {
  return {
    str: arg.str,
    num: arg.num
  };
}

export function nestedObjectArgFunction(arg: ObjectWithChildren): string {
  return arg.obj1.str + " " + arg.obj1.num.toString() + " " + arg.obj2.str2 + " " + arg.obj2.num2.toString();
}

export function nestedObjectResultFunction(arg: ObjectWithChildren): ObjectWithChildren {
  return {
    obj1: {
        str: arg.obj1.str,
        num: arg.obj1.num
    },
    obj2: {
        str2: arg.obj2.str2,
        num2: arg.obj2.num2
    }
  };
}

export class TestClass implements ITestClass {
  constructor(private readonly arg: string) {
  }

  static testStaticMethod(arg: string): string {
    return arg;
  }

  testInstanceMethod(arg: string): string {
    return this.arg + " " + arg;
  }
}

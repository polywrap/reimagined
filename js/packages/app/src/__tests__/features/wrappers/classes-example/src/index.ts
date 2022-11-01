import { ITestClass } from "./polywrap/wrapped/classes/list/TestClass/ITestClass";

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

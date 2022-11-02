import { TestExternalClass } from "./polywrap/wrapped/types/TestExternalClass";
import { testExternalGlobalFunction } from "./polywrap/wrapped/types/testExternalGlobalFunction";

export function testReceiveReference(arg: TestExternalClass): string {
  return arg.testInstanceMethod("test");
}

export function testInvokeExternalStaticMethod(arg: string): string {
  return TestExternalClass.testStaticMethod(arg);
}

export function testInvokeExternalGlobalFunction(arg: string): string {
  return testExternalGlobalFunction(arg);
}

export class TestObjectGetter {
  constructor(private readonly arg: string) {
  }

  testInstanceReceiveReference(arg: TestExternalClass): string {
    return arg.testInstanceMethod("test");
  }

  static testStaticReceiveReference(arg: TestExternalClass): string {
    return arg.testInstanceMethod("test");
  }
}

import { testExternalGlobalFunction, TestExternalClass } from "./polywrap/external";

export function testReceiveReference(arg: TestExternalClass): string {
  return arg.testInstanceMethod("test");
}

export function testInvokeExternalGlobalFunction(arg: string): string {
  return testExternalGlobalFunction(arg);
}

export function testInvokeExternalStaticMethod(arg: string): string {
  return TestExternalClass.testStaticMethod(arg);
}

export function testInvokeExternalInstanceMethod(arg: string): string {
  const object = TestExternalClass.create(arg);

  return object.testInstanceMethod(arg);
}

export class TestObjectGetter {
  constructor(private readonly arg: string) {
  }

  static create(arg: string): TestObjectGetter {
    return new TestObjectGetter(arg);
  }

  testInstanceReceiveReference(arg: TestExternalClass): string {
    return arg.testInstanceMethod("test");
  }

  static testStaticReceiveReference(arg: TestExternalClass): string {
    return arg.testInstanceMethod("test");
  }
}

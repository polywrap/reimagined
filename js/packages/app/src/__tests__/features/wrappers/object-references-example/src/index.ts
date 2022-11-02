import { TestExternalClass } from "./polywrap/wrapped/types/TestExternalClass";

export function testReturnReference(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
}

export function testReceiveReference(arg: TestExternalClass): string {
  return arg.testInstanceMethod("test");
}

export class TestInternalClass {
  constructor(private readonly arg: string) {
  }

  testInstanceMethod(arg: string): string {
    return this.arg + " " + arg;
  }
}

export class TestObjectGetter {
  constructor(private readonly arg: string) {
  }

  testInstanceMethod(arg: string): TestInternalClass {
    return new TestInternalClass(this.arg + " " + arg);
  }

  static testStaticMethod(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
  }

  testInstanceReceiveReference(arg: TestExternalClass): string {
    return arg.testInstanceMethod("test");
  }

  static testStaticReceiveReference(arg: TestExternalClass): string {
    return arg.testInstanceMethod("test");
  }
}

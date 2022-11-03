import { wrap_log } from "./polywrap/wrap/host-resources/wrap_log";

// export const referenceMap = new Map<u32, TestObjectGetter>();

export function testReturnReference(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
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
    wrap_log("testInstanceMethod: " + arg);
    wrap_log(this.arg);
    return new TestInternalClass(this.arg + " " + arg);
  }

  static testStaticMethod(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
  }
}

export function testGlobalFunction(arg: string): TestInternalClass {
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
    return new TestInternalClass(this.arg + " " + arg);
  }

  static testStaticMethod(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
  }
}

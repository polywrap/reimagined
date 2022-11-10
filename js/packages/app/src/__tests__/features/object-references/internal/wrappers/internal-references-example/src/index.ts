export function testReturnReference(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
}

export class TestInternalClass {
  constructor(private readonly arg: string) {
  }

  static create(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
  }

  testInstanceMethod(arg: string): string {
    return this.arg + " " + arg;
  }
}

export class TestObjectGetter {
  constructor(private readonly arg: string) {
  }

  static create(arg: string): TestObjectGetter {
    return new TestObjectGetter(arg);
  }

  testInstanceMethod(arg: string): TestInternalClass {
    return new TestInternalClass(this.arg + " " + arg);
  }

  static testStaticMethod(arg: string): TestInternalClass {
    return new TestInternalClass(arg);
  }
}

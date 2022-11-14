export class TestObject {
  constructor(
    public str: string,
    public num: u32,
  ) {
  }
}

export class ObjectWithChildren {
  constructor(
    public obj1: TestObject,
    public obj2: TestObject2,
  ) {
  }
}

export class TestObject2 {
  constructor(
    public str2: string,
    public num2: u32,
  ) {
  }
}

export class TestClass {
  constructor(private readonly arg: string) {
  }

  static create(arg: string): TestClass {
    return new TestClass(arg);
  }

  static testStaticMethod(arg: string): string {
    return arg;
  }

  testInstanceMethod(arg: string): string {
    return this.arg + " " + arg;
  }
}

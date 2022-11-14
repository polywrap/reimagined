export class TestObject {
  constructor(
    public str: string,
    public num: number,
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
    public num2: number,
  ) {
  }
}
export class SomeExternal {
  constructor(private arg: string) {

  }
  static create(): SomeExternal {
    return new SomeExternal("testingy");
  }
  getValue(): string {
    return this.arg;
  }
}

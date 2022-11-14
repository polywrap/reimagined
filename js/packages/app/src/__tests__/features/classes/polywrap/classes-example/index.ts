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

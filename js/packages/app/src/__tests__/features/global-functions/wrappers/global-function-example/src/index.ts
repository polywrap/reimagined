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

export function stringArgFunction(arg: string): string {
    return arg;
}

export function objectArgFunction(arg: TestObject): string {
  return arg.str + " " + arg.num.toString();
}

export function objectResultFunction(arg: TestObject): TestObject {
  return new TestObject(
    arg.str,
    arg.num
  );
}

export function nestedObjectArgFunction(arg: ObjectWithChildren): string {
  return arg.obj1.str + " " + arg.obj1.num.toString() + " " + arg.obj2.str2 + " " + arg.obj2.num2.toString();
}

export function nestedObjectResultFunction(arg: ObjectWithChildren): ObjectWithChildren {
  return new ObjectWithChildren(
    new TestObject(
      arg.obj1.str,
      arg.obj1.num
    ),
    new TestObject2(
      arg.obj2.str2,
      arg.obj2.num2
    )
  );
}

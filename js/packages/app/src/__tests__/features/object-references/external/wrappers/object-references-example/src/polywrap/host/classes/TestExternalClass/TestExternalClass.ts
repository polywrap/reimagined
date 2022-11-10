import { wrapInstance } from '../../../wrap/WrapInstance';
import { ClassList } from '../ClassList';
import { TestExternalClassMethod } from './TestExternalClassMethod';
import { TestExternalClassWrapped } from '../../../wrapped/TestExternalClassWrapped';

@serializable
export class TestExternalClass {
  constructor(private readonly __referencePtr: u32) {
  }

  static create(arg: string): TestExternalClass {
    const result = wrapInstance.invokeStaticMethod<CreateArgsWrapped, TestExternalClassWrapped>(
      ClassList.TestExternalClass, 
      TestExternalClassMethod.Create, 
      new CreateArgsWrapped( 
        arg 
      )
    );

    return TestExternalClassWrapped.mapFromSerializable(result);
  }

  testInstanceMethod(arg: string): string {
    const result = wrapInstance.invokeInstanceMethod<TestInstanceMethodArgsWrapped, string>(
      ClassList.TestExternalClass, 
      TestExternalClassMethod.Create, 
      this.__referencePtr,
      new TestInstanceMethodArgsWrapped(
        arg
      )
    );

    return result;
  }

  static testStaticMethod(arg: string): string {
    const result = wrapInstance.invokeStaticMethod<TestStaticMethodArgsWrapped, string>(
      ClassList.TestExternalClass, 
      TestExternalClassMethod.TestStaticMethod, 
      new TestStaticMethodArgsWrapped(
        arg
      )
    );

    return result;
  }
}

@serializable
class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
export class TestStaticMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
export class TestStaticMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
export class TestInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }
}

import { wrapInstance } from '../../../wrap/WrapInstance';
import { ClassList } from '../ClassList';
import { TestExternalClassMethod } from './TestExternalClassMethod';

@serializable
export class TestExternalClass {
  constructor(private readonly __referencePtr: u32) {
  }

  static create(arg: string): TestExternalClass {
    const result = wrapInstance.invokeClassMethod<CreateArgsWrapped, TestExternalClassWrapped>(
      ClassList.TestExternalClass, 
      TestExternalClassMethod.Create, 
      new CreateArgsWrapped( 
        arg 
      )
    );

    return new TestExternalClass(
      result.__referencePtr
    );
  }

  testInstanceMethod(arg: string): string {
    const result = wrapInstance.invokeClassMethod<TestInstanceMethodArgsWrapped, string>(
      ClassList.TestExternalClass, 
      TestExternalClassMethod.Create, 
      new TestInstanceMethodArgsWrapped(
        this.__referencePtr,
        new TestInstanceMethodArgs(
          arg
        )
      )
    );

    return result;
  }

  static testStaticMethod(arg: string): string {
    const result = wrapInstance.invokeClassMethod<TestStaticMethodArgs, string>(
      ClassList.TestExternalClass, 
      TestExternalClassMethod.TestStaticMethod, 
      new TestStaticMethodArgs(
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
export class TestStaticMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
export class TestInstanceMethodArgsWrapped {
  constructor(
    public __referencePtr: u32,
    public args: TestInstanceMethodArgs,
  ) {
  }
}

@serializable
export class TestInstanceMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
export class TestExternalClassWrapped {
  constructor(
    public __referencePtr: u32,
  ) {
  }
}

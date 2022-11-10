import { IWrapInterface, wrapInstance } from '../../wrap/WrapInstance';

export enum GlobalFunctionList {
  TestExternalGlobalFunction = 0
}

export const testExternalGlobalFunction = (arg: string): string => {
  return testExternalGlobalFunctionFromInstance(
    wrapInstance,
    arg
  );
}

export const testExternalGlobalFunctionFromInstance = (instance: IWrapInterface, arg: string): string => {
  const result = instance.invokeGlobalFunction<TestExternalGlobalFunctionArgsWrapped, string>(
    GlobalFunctionList.TestExternalGlobalFunction,
    TestExternalGlobalFunctionArgsWrapped.mapToSerializable(
      new TestExternalGlobalFunctionArgs(
        arg
      )
    )
  );

  return result;
}

@serializable
export class TestExternalGlobalFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static mapToSerializable(value: TestExternalGlobalFunctionArgs): TestExternalGlobalFunctionArgsWrapped {
    return new TestExternalGlobalFunctionArgsWrapped(
      value.arg,
    );
  }
}

export class TestExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

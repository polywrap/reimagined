import { stringify } from '@serial-as/json';
import { concat, u32ToBuffer } from '../../buffer';
import { BaseTypeSerialization } from '../../serialization/BaseTypeSerialization';
import { HostResource } from '../../wrap/host-resources/HostResource';
import { IWrapInstance, wrapInstance } from '../../wrap/WrapInstance';

export enum GlobalFunctionList {
  TestExternalGlobalFunction = 0
}

export const testExternalGlobalFunction = (arg: string): string => {
  return testExternalGlobalFunctionFromInstance(
    wrapInstance,
    arg
  );
}

export const testExternalGlobalFunctionFromInstance = (instance: IWrapInstance, arg: string): string => {
  const args = new TestExternalGlobalFunctionArgs(
    arg,
  );

  const buffer = concat(
      u32ToBuffer(WrapManifest.External.GlobalFunction.TestExternalGlobalFunction),
      TestExternalGlobalFunctionArgsWrapped.serialize(args),
  );

  const result = instance.invokeResource(HostResource.InvokeGlobalFunction, buffer);

  return BaseTypeSerialization.deserialize<string>(result);
}

export class TestExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
export class TestExternalGlobalFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestExternalGlobalFunctionArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestExternalGlobalFunctionArgsWrapped>(
        TestExternalGlobalFunctionArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestExternalGlobalFunctionArgs): TestExternalGlobalFunctionArgsWrapped {
    return new TestExternalGlobalFunctionArgsWrapped(
      value.arg,
    );
  }
}

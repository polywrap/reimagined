import { stringify } from '@serial-as/json'
import { concat, u32ToBuffer } from '../../buffer';
import { HostResource } from "../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../wrap/host-resources/invoke_host_resource";
import { BaseTypeSerialization } from '../../serialization/BaseTypeSerialization';
import { GlobalFunctionList } from './GlobalFunctionList';

export const testExternalGlobalFunction = (arg: string): string => {
  const buffer = 
    concat(
      u32ToBuffer(GlobalFunctionList.TestExternalGlobalFunction),
      TestExternalGlobalFunctionArgsWrapped.serialize(
        new TestExternalGlobalFunctionArgs(
          arg
        )
      )
    );

  const result = invoke_host_resource(HostResource.InvokeGlobalFunction, buffer);

  return BaseTypeSerialization.deserialize<string>(result);
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

export class TestExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

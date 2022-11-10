import { wrapInstance } from '../../wrap/WrapInstance';
import { ClassList } from '../ClassList';
import { TestExternalClassWrapped } from '../../wrapped/TestExternalClassWrapped';
import { concat, u32ToBuffer } from '../../buffer';
import { HostResource } from '../../wrap/host-resources/HostResource';
import { invoke_host_resource } from '../../wrap/host-resources/invoke_host_resource';
import { Resources } from '../../Resources';
import { stringify } from '@serial-as/json';

enum TestExternalClassMethod {
  Create = 0,
  TestInstanceMethod = 1,
  TestStaticMethod = 2,
}

@serializable
export class TestExternalClass {
  constructor(private readonly __referencePtr: u32) {
  }

  static create(arg: string): TestExternalClass {
    const args = new CreateArgs(
      arg,
    );

    const buffer = concat(
        u32ToBuffer(WrapManifest.External.Classes.TestExternalClassMethod.Create),
        CreateArgsWrapped.serialize(args),
    );

    const result = wrapInstance.invokeResource(HostResource.InvokeClassMethod, buffer);

    return TestExternalClassWrapped.deserialize(result);
  }

  testInstanceMethod(arg: string): string {
    const result = wrapInstance.invokeInstanceMethod<TestInstanceMethodArgsWrapped, string>(
      WrapManifest.External.Class.TestExternalClass, 
      WrapManifest.External.Classes.TestExternalClassMethod.TestInstanceMethod, 
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

class CreateArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: CreateArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<CreateArgsWrapped>(
        CreateArgsWrapped.mapToSerializable(value)
      )
    );
  }

  private static mapToSerializable(value: CreateArgs): CreateArgsWrapped {
    return new CreateArgsWrapped(
      value.arg,
    );
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

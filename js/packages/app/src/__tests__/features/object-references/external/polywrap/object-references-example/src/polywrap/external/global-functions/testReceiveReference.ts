import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@nerfzael/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';
import { TestExternalClassWrapped } from "../../wrapped";

import { TestExternalClass } from "../../..";



export function testReceiveReference(
  arg: TestExternalClass,
): string {
  return testReceiveReferenceFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: TestExternalClass,
  ): string => {
    return testReceiveReferenceFromInstance(
      instance, 
      arg,
    );
  };
};

export const testReceiveReferenceFromInstance = (
  instance: IExternalWrapInstance | null, 
  arg: TestExternalClass,
): string => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const args = new TestReceiveReferenceArgs(
    arg,
  );

  const buffer = concat([
    u32ToBuffer(WrapManifest.External.GlobalFunction.TestReceiveReference),
    TestReceiveReferenceArgsWrapped.serialize(args),
  ]);

  const result = instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

@serializable
export class TestReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static serialize(value: TestReceiveReferenceArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestReceiveReferenceArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestReceiveReferenceArgs): TestReceiveReferenceArgsWrapped {
    return new TestReceiveReferenceArgsWrapped(
            
      value.arg,
      
    );
  }
}

export class TestReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

import { concat, u32ToBuffer, IExternalWrapInstance, BaseTypeSerialization } from '@polywrap/reim-wrap-js';
import { WrapModule } from '../module/WrapModule';
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from '../../dt/ExternalResource';
import { TestExternalClassWrapped } from "../../wrapped";

import { TestExternalClass } from "../../..";



export function testReceiveReference(
  arg: TestExternalClass,
): Promise<string> {
  return testReceiveReferenceFromInstance(
    WrapModule.wrapInstance,
    arg,
  );
};

export const create = (instance: IExternalWrapInstance) => {
  return (
    arg: TestExternalClass,
  ): Promise<string> => {
    return testReceiveReferenceFromInstance(
      instance, 
      arg,
    );
  };
};

export const testReceiveReferenceFromInstance = async (
  instance: IExternalWrapInstance | null, 
  arg: TestExternalClass,
): Promise<string> => {
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

  const result = await instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer);

  
  return BaseTypeSerialization.deserialize<string>(result);
}

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
      
      TestExternalClassWrapped.mapToSerializable(value.arg),
            
    );
  }
}

export class TestReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
  ) {
  }
}

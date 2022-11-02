import { parse, stringify } from '@serial-as/json'
import { concat, u32ToBuffer } from '../../buffer';
import { HostResource } from "../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from '../../wrap/host-resources/wrap_log';

export const CLASS_ID = 0;

@serializable
export class TestExternalClass {
  constructor(
    private __objectReferencePtr: u32,
  ) {
  }

  testInstanceMethod(arg: string): string {
    const buffer = 
      concat(
        concat(
          u32ToBuffer(CLASS_ID),
          u32ToBuffer(0),
        ),
        serializeTestInstanceMethodArgs(
          new TestInstanceMethodArgsWrapped(
            this.__objectReferencePtr,
            new TestInstanceMethodArgs(
              arg
            )
          )
        )
      );

    const result = invoke_host_resource(HostResource.InvokeClassMethod, buffer);
    wrap_log("testInstanceMethod: result");

    invoke_host_resource(HostResource.Log, result);

    const text = deserializeTestInstanceMethodResult(result);
    
    wrap_log("testInstanceMethod: " + text);
    return text;
  }
}

export function serializeTestInstanceMethodArgs(type: TestInstanceMethodArgsWrapped): ArrayBuffer {
  return String.UTF8.encode(stringify<TestInstanceMethodArgsWrapped>(type));
}

export function deserializeTestInstanceMethodResult(buffer: ArrayBuffer): string {
  return parse<string>(String.UTF8.decode(buffer));
}

@serializable
export class TestInstanceMethodArgsWrapped {
  constructor(
    public __objectReferencePtr: u32,
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
    public __objectReferencePtr: u32,
  ) {
  }
}

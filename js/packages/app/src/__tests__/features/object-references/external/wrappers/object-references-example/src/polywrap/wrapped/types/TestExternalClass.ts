import { parse, stringify } from '@serial-as/json'
import { concat, u32ToBuffer } from '../../buffer';
import { HostResource } from "../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from '../../wrap/host-resources/wrap_log';

export const CLASS_ID = 0;

@serializable
export class TestExternalClass {
  constructor(private readonly __objectReferencePtr: u32) {
  }

  static create(arg: string): TestExternalClass {
    const buffer = 
      concat(
        concat(
          u32ToBuffer(CLASS_ID),
          u32ToBuffer(0),
        ),
        serializeTestStaticMethodArgs(
          new TestStaticMethodArgs(
            arg
          )
        )
      );

    const result = invoke_host_resource(HostResource.InvokeClassMethod, buffer);
    wrap_log("constructor: result");

    invoke_host_resource(HostResource.Log, result);

    const objectReferencePtr = deserializeCtorResult(result);
    
    wrap_log("constructor: " + objectReferencePtr.toString());
    return new TestExternalClass(objectReferencePtr);
  }

  testInstanceMethod(arg: string): string {
    const buffer = 
      concat(
        concat(
          u32ToBuffer(CLASS_ID),
          u32ToBuffer(1),
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

  static testStaticMethod(arg: string): string {
    const buffer = 
      concat(
        concat(
          u32ToBuffer(CLASS_ID),
          u32ToBuffer(2),
        ),
        serializeTestStaticMethodArgs(
          new TestStaticMethodArgs(
            arg
          )
        )
      );

    const result = invoke_host_resource(HostResource.InvokeClassMethod, buffer);
    wrap_log("testInstanceMethod: result");

    invoke_host_resource(HostResource.Log, result);

    const text = deserializeTestStaticMethodResult(result);
    
    wrap_log("testInstanceMethod: " + text);
    return text;
  }
}

@serializable
export class TestStaticMethodArgs {
  constructor(
    public arg: string,
  ) {
  }
}

export function deserializeCtorResult(buffer: ArrayBuffer): u32 {
  return parse<u32>(String.UTF8.decode(buffer));
}

export function serializeTestStaticMethodArgs(type: TestStaticMethodArgs): ArrayBuffer {
  return String.UTF8.encode(stringify<TestStaticMethodArgs>(type));
}

export function deserializeTestStaticMethodResult(buffer: ArrayBuffer): string {
  return parse<string>(String.UTF8.decode(buffer));
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

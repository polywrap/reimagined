import { parse, stringify } from '@serial-as/json'
import { concat, u32ToBuffer } from '../../buffer';
import { HostResource } from "../../wrap/host-resources/HostResource";
import { invoke_host_resource } from "../../wrap/host-resources/invoke_host_resource";
import { wrap_log } from '../../wrap/host-resources/wrap_log';

export const CLASS_ID = 0;

@serializable
export const testExternalGlobalFunction = (arg: string): string => {
  const buffer = 
    concat(
      u32ToBuffer(0),
      serializeTestExternalGlobalFunctionArgs(
        new TestExternalGlobalFunctionArgs(
          arg
        )
      )
    );

  const result = invoke_host_resource(HostResource.InvokeGlobalFunction, buffer);
  wrap_log("testExternalGlobalFunction: result");

  invoke_host_resource(HostResource.Log, result);

  const text = deserializeTestExternalGlobalFunctionResult(result);
  
  wrap_log("testExternalGlobalFunction: " + text);
  return text;
}

@serializable
export class TestExternalGlobalFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

export function serializeTestExternalGlobalFunctionArgs(type: TestExternalGlobalFunctionArgs): ArrayBuffer {
  return String.UTF8.encode(stringify<TestExternalGlobalFunctionArgs>(type));
}

export function deserializeTestExternalGlobalFunctionResult(buffer: ArrayBuffer): string {
  return parse<string>(String.UTF8.decode(buffer));
}

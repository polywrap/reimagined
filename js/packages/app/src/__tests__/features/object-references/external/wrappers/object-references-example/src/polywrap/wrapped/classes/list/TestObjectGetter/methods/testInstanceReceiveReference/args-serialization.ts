import { stringify, parse } from '@serial-as/json'
import { TestExternalClass } from '../../../../../types/TestExternalClass';
import { Args, InstanceInfo, MethodArgs } from "./args";

export function serializeType(type: Args): ArrayBuffer {
  return String.UTF8.encode(stringify<Args>(type));
}

export function deserializeType(buffer: ArrayBuffer): MethodArgs {
  const args = parse<InstanceInfo>(String.UTF8.decode(buffer));

  return new MethodArgs(
    args.objectReferencePtr,
    new Args(
      new TestExternalClass(
        args.args.arg.__objectReferencePtr
      )
    ),
  );
}

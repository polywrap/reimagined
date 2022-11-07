import { stringify, parse } from '@serial-as/json'
import { TestExternalClass } from '../../../../host/TestExternalClass';
import { Args, SerializedArgs } from "./args";

export function serializeType(type: Args): ArrayBuffer {
  return String.UTF8.encode(stringify<Args>(type));
}

export function deserializeType(buffer: ArrayBuffer): Args {
  const args = parse<SerializedArgs>(String.UTF8.decode(buffer));

  return new Args(
    new TestExternalClass(args.arg.__objectReferencePtr),
  );
}

import { parse } from '@serial-as/json'
import { TestObjectGetter } from '../../../../../..';
import { TestObjectGetterWrapped } from '../TestObjectGetterWrapped';

export function createWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = TestObjectGetter.create(args.arg);

  return TestObjectGetterWrapped.serialize(result);
}

@serializable
export class Args {
  constructor(
    public arg: string,
  ) {}

  static deserialize(buffer: ArrayBuffer): Args {
    return parse<Args>(String.UTF8.decode(buffer));
  }
}

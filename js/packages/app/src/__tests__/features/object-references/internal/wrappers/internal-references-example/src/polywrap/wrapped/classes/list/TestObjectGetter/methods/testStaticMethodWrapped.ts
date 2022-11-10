import { parse } from '@serial-as/json'
import { TestObjectGetter } from '../../../../../..';
import { TestInternalClassWrapped } from '../../TestInternalClass/TestInternalClassWrapped';

export function testStaticMethodWrapped(dataBuffer: ArrayBuffer): ArrayBuffer {
  const args = Args.deserialize(dataBuffer);

  const result = TestObjectGetter.testStaticMethod(args.arg);

  return TestInternalClassWrapped.serialize(result);
}

@serializable
export class Args {
  constructor(
    public arg: string
  ) {}

  static deserialize(buffer: ArrayBuffer): Args {
    return parse<Args>(String.UTF8.decode(buffer));
  }
}

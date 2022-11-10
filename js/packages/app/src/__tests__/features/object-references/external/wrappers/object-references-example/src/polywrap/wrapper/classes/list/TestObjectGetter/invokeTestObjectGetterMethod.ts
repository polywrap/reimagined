import { parse } from "@serial-as/json";
import { testInstanceReceiveReferenceWrapped } from "./methods/testInstanceReceiveReference";
import { testStaticReceiveReferenceWrapped } from "./methods/testStaticReceiveReference";

export enum TestObjectGetterMethod {
  Create = 0,
  TestInstanceReceiveReference = 1,
  TestStaticReceiveReference = 2,
}

export function invokeTestObjectGetterMethod(method: TestObjectGetterMethod, buffer: ArrayBuffer): ArrayBuffer {  
  switch (method) {
    case TestObjectGetterMethod.Create:
      const args = CreateArgsWrapped.deserialize(buffer);

      const result = TestObjectGetter.create(args.arg);
    
      return TestObjectGetterWrapped.serialize(result);
    case TestObjectGetterMethod.TestInstanceReceiveReference:
      return testInstanceReceiveReferenceWrapped(buffer);
    case TestObjectGetterMethod.TestStaticReceiveReference:
      return testStaticReceiveReferenceWrapped(buffer);
    default:
      throw new Error("Unknown method " + method.toString());
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

  static deserialize(buffer: ArrayBuffer): CreateArgs {
    const args = parse<CreateArgsWrapped>(String.UTF8.decode(buffer));
  
    return new CreateArgs(
      args.arg,
    );
  }
}

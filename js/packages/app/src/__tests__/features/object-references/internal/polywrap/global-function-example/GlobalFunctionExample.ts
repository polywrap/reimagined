import { IWrapper } from "@polywrap/reim-wrap";
import { ObjectArgFunctionArgs } from "./ObjectArgFunctionArgs";
import { ObjectResultFunctionArgs } from "./ObjectResultFunctionArgs";
import { StringArgFunctionArgs } from "./StringArgFunctionArgs";
import { NestedObjectArgFunctionArgs } from "./NestedObjectArgFunctionArgs";
import { NestedObjectResultFunctionArgs } from "./NestedObjectResultFunctionArgs";
import { TestObject } from "./TestObject";
import { ObjectWithChildren } from "./ObjectWithChildren";

export class GlobalFunctionExample {
  static from(wrapper: IWrapper) {
    return {
      stringArgFunction: (arg: string): Promise<string> => {
        return wrapper.invokeGlobalFunction<StringArgFunctionArgs, string>("stringArgFunction", { arg });
      },
      objectArgFunction: (arg: TestObject): Promise<string> => {
        return wrapper.invokeGlobalFunction<ObjectArgFunctionArgs, string>("objectArgFunction", { arg });
      },
      objectResultFunction: (arg: TestObject): Promise<TestObject> => {
        return wrapper.invokeGlobalFunction<ObjectResultFunctionArgs, TestObject>("objectResultFunction", { arg });
      },
      nestedObjectArgFunction: (arg: ObjectWithChildren): Promise<string> => {
        return wrapper.invokeGlobalFunction<NestedObjectArgFunctionArgs, string>("nestedObjectArgFunction", { arg });
      },
      nestedObjectResultFunction: (arg: ObjectWithChildren): Promise<ObjectWithChildren> => {
        return wrapper.invokeGlobalFunction<NestedObjectResultFunctionArgs, ObjectWithChildren>("nestedObjectResultFunction", { arg });
      },
    };
  }
}

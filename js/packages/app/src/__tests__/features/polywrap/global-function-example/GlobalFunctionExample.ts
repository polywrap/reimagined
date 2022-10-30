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
      stringArgFunction: async (arg: string): Promise<string> => {
        return await wrapper.invokeGlobalFunction<StringArgFunctionArgs, string>("stringArgFunction", { arg });
      },
      objectArgFunction: async (arg: TestObject): Promise<string> => {
        return await wrapper.invokeGlobalFunction<ObjectArgFunctionArgs, string>("objectArgFunction", { arg });
      },
      objectResultFunction: async (arg: TestObject): Promise<TestObject> => {
        return await wrapper.invokeGlobalFunction<ObjectResultFunctionArgs, TestObject>("objectResultFunction", { arg });
      },
      nestedObjectArgFunction: async (arg: ObjectWithChildren): Promise<string> => {
        return await wrapper.invokeGlobalFunction<NestedObjectArgFunctionArgs, string>("nestedObjectArgFunction", { arg });
      },
      nestedObjectResultFunction: async (arg: ObjectWithChildren): Promise<ObjectWithChildren> => {
        return await wrapper.invokeGlobalFunction<NestedObjectResultFunctionArgs, ObjectWithChildren>("nestedObjectResultFunction", { arg });
      },
    };
  }
}

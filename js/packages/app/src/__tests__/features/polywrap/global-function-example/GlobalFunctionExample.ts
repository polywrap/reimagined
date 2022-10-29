import { IWrapper } from "@polywrap/reim-wrap";
import { ObjectArgFunctionArgs } from "./ObjectArgFunctionArgs";
import { ObjectResultFunctionArgs } from "./ObjectResultFunctionArgs";
import { StringArgFunctionArgs } from "./StringArgFunctionArgs";
import { NestedObjectArgFunctionArgs } from "./NestedObjectArgFunctionArgs";
import { NestedObjectResultFunctionArgs } from "./NestedObjectResultFunctionArgs";
import { TestObject } from "./TestObject";
import { ObjectWithChildren } from "./ObjectWithChildren";

export class GlobalFunctionExample {
  constructor(private readonly __wrapper: IWrapper) { }

  static from(wrapper: IWrapper) {
    return new GlobalFunctionExample(wrapper);
  }

  functions() {
    return {
      stringArgFunction: async (arg: string): Promise<string> => {
        return await this.__wrapper.invokeGlobalFunction<StringArgFunctionArgs, string>("stringArgFunction", { arg });
      },
      objectArgFunction: async (arg: TestObject): Promise<string> => {
        return await this.__wrapper.invokeGlobalFunction<ObjectArgFunctionArgs, string>("objectArgFunction", { arg });
      },
      objectResultFunction: async (arg: TestObject): Promise<TestObject> => {
        return await this.__wrapper.invokeGlobalFunction<ObjectResultFunctionArgs, TestObject>("objectResultFunction", { arg });
      },
      nestedObjectArgFunction: async (arg: ObjectWithChildren): Promise<string> => {
        return await this.__wrapper.invokeGlobalFunction<NestedObjectArgFunctionArgs, string>("nestedObjectArgFunction", { arg });
      },
      nestedObjectResultFunction: async (arg: ObjectWithChildren): Promise<ObjectWithChildren> => {
        return await this.__wrapper.invokeGlobalFunction<NestedObjectResultFunctionArgs, ObjectWithChildren>("nestedObjectResultFunction", { arg });
      },
    };
  }
}

import { wrap_log } from "./polywrap/wrap/host-functions/wrap_log";
import { TestObject } from "./polywrap/wrapped/types/TestObject";

export function stringArgFunction(arg: string): string {
    return arg;
}

export function objectArgFunction(arg: TestObject): string {
  wrap_log("objectArgFunction inside");
  wrap_log(arg.str + " " + arg.num.toString());
  return arg.str + " " + arg.num.toString();
}

export function objectResultFunction(arg: TestObject): TestObject {
  return {
    str: arg.str,
    num: arg.num
  };
}

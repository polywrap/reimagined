import { wrap_log } from "./polywrap/wrap/host-functions/wrap_log";
import { ObjectWithChildren } from "./polywrap/wrapped/types/ObjectWithChildren";
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

export function nestedObjectArgFunction(arg: ObjectWithChildren): string {
  wrap_log("objectArgFunction inside");
  wrap_log(arg.obj1.str + " " + arg.obj1.num.toString() + " " + arg.obj2.str2 + " " + arg.obj2.num2.toString());
  return arg.obj1.str + " " + arg.obj1.num.toString() + " " + arg.obj2.str2 + " " + arg.obj2.num2.toString();
}

export function nestedObjectResultFunction(arg: ObjectWithChildren): ObjectWithChildren {
  return {
    obj1: {
        str: arg.obj1.str,
        num: arg.obj1.num
    },
    obj2: {
        str2: arg.obj2.str2,
        num2: arg.obj2.num2
    }
  };
}

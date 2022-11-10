import { IWrapper } from "@polywrap/reim-wrap";
import { create as createStringArgFunction } from "./global-functions/stringArgFunction/create";
import { create as createObjectArgFunction } from "./global-functions/objectArgFunction/create";
import { create as createObjectResultFunction } from "./global-functions/objectResultFunction/create";
import { create as createNestedObjectArgFunction } from "./global-functions/nestedObjectArgFunction/create";
import { create as createNestedObjectResultFunction } from "./global-functions/nestedObjectResultFunction/create";

export class GlobalFunctionExample {
  static from(wrapper: IWrapper) {
    return {
      stringArgFunction: createStringArgFunction(wrapper),
      objectArgFunction: createObjectArgFunction(wrapper),
      objectResultFunction: createObjectResultFunction(wrapper),
      nestedObjectArgFunction: createNestedObjectArgFunction(wrapper),
      nestedObjectResultFunction: createNestedObjectResultFunction(wrapper),
    };
  }
}

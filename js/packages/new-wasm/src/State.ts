import { Result } from "@polywrap/result";
import { IWrapInstance } from "@polywrap/reim-wrap";
import { WasmInstance } from "./WasmInstance";

export interface State {
  wasmInstance?: WasmInstance;
  wrapInstances: Map<number, IWrapInstance>;
  classInstances: Map<number, {
    className: string;
    classInstance: any
  }>;
  inputBuffer: Uint8Array;
  args: Uint8Array;
  invoke: {
    result?: Uint8Array;
    error?: string;
  };
  subinvoke: {
    result?: Uint8Array;
    error?: string;
    args: unknown[];
  };
  invokeInstance: {
    result?: Uint8Array;
    error?: string;
    args: unknown[];
  };
  subinvokeImplementation: {
    result?: Uint8Array;
    error?: string;
    args: unknown[];
  };
  invokeResult: Result<unknown, unknown>;
  env: Uint8Array;
}

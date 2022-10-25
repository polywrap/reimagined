import { Context, ReadDecoder } from "@polywrap/wasm-as";

export function deserializeString(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: encodeParams");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("encodeParams", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_encodeFunction {
  method: string;
  args: Array<string> | null;
}
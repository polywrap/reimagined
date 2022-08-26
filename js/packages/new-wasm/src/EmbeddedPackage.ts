import { WasmPackage } from "./WasmPackage";
import { EmbeddedFileReader } from "./EmbeddedFileReader";

export class EmbeddedPackage extends WasmPackage {
  constructor(manifest: Uint8Array, module: Uint8Array) {
    const reader = new EmbeddedFileReader(manifest, module);

    super(reader);
  }
}
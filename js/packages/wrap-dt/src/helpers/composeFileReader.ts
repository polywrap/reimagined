// Helper function for creating wasm packages

import { InMemoryFileReader } from "../InMemoryFileReader";
import { IFileReader } from "@polywrap/reim-wrap";

// Not meant for exporting out of this library
export const composeFileReader = (
  manifestBufferOrFileReader: Uint8Array | IFileReader,
  wasmModuleOrFileReader?: Uint8Array | IFileReader,
  fileReader?: IFileReader
): IFileReader => {
  let manifestBuffer: Uint8Array | undefined;
  let wasmModule: Uint8Array | undefined;
  let builtFileReader: IFileReader | undefined = fileReader;

  if (manifestBufferOrFileReader instanceof Uint8Array) {
    manifestBuffer = manifestBufferOrFileReader as Uint8Array;
  } else {
    builtFileReader = manifestBufferOrFileReader as IFileReader;
  }

  if (wasmModuleOrFileReader) {
    if (wasmModuleOrFileReader instanceof Uint8Array) {
      wasmModule = wasmModuleOrFileReader as Uint8Array;
    } else if ((wasmModuleOrFileReader as Partial<IFileReader>).readFile) {
      builtFileReader = wasmModuleOrFileReader as IFileReader;
    }
  }

  if (manifestBuffer) {
    if (wasmModule) {
      return InMemoryFileReader.from(
        manifestBuffer,
        wasmModule,
        builtFileReader as IFileReader
      );
    } else {
      return InMemoryFileReader.fromManifest(
        manifestBuffer,
        builtFileReader as IFileReader
      )
    }
  } else {
    return builtFileReader as IFileReader;
  }
};

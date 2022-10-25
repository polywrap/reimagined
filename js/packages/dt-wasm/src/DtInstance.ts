import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import { State } from "./State";
import { DtExports } from "./DtExports";
import { readBytes } from "./buffer";
import { DtImports } from "./DtImports";

export class DtInstance {
  public static requiredExports: readonly string[] = ["_dt_receive"];

  constructor(
    private readonly state: State, 
    private readonly wasmInstance: AsyncWasmInstance,
    private readonly wasmMemory: WebAssembly.Memory
  ) {
  }

  static async create(
    wasmModule: Uint8Array
  ): Promise<DtInstance> {
    const state: State = {
      inputBuffer: new Uint8Array(),
      sendResult: new Uint8Array(),
      onReceive: async (_: Uint8Array) => {
        throw new Error("onReceive callback is not set");
      }
    };

    const memory = AsyncWasmInstance.createMemory({ module: wasmModule });
    const instance: AsyncWasmInstance = await AsyncWasmInstance.createInstance({
      module: wasmModule,
      imports: new DtImports(
        memory,
        state
      ) as unknown as WebAssembly.Imports,
      requiredExports: DtInstance.requiredExports,
    });

    return new DtInstance(state, instance, memory);
  }

  public async send(buffer: Uint8Array, onReceive: (buffer: Uint8Array) => Promise<Uint8Array>): Promise<Uint8Array> {
    this.state.inputBuffer = buffer;
    this.state.onReceive = onReceive;
    
    const exports = this.wasmInstance.exports as DtExports;

    const lenAndResultPtr = await exports._dt_receive(
      this.state.inputBuffer.byteLength,
    );

    const lenBuffer = readBytes(this.wasmMemory.buffer, lenAndResultPtr, 4);
    const len = new DataView(lenBuffer).getUint32(0);
    
    const resultBuffer = readBytes(this.wasmMemory.buffer, lenAndResultPtr + 4, len);

    return new Uint8Array(resultBuffer);
  }
}

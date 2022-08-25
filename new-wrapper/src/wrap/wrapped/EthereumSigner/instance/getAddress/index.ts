import { EthereumSigner } from "../../../../..";
import { serializeResult } from "./serializeResult";

export function getAddressWrapped(instance: EthereumSigner, dataBuffer: ArrayBuffer): ArrayBuffer {
  const result = instance.getAddress(
  );

  return serializeResult(result);
}

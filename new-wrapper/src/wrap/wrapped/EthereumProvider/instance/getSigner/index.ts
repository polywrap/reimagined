import { EthereumProvider } from "../../../../..";
import { EthereumSignerWrapped } from "../../../EthereumSigner";

export function getSignerWrapped(instance: EthereumProvider, dataBuffer: ArrayBuffer): ArrayBuffer {
  const result = instance.getSigner(
  );

  const ptr = changetype<u32>(result);
  
  return EthereumSignerWrapped.toBuffer({
  __classInstancePtr: ptr
  });
}

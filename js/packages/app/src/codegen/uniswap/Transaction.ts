import { IWrapper} from "@polywrap/reim-wrap";
import { IReceipt } from "./Receipt";

export interface ITransaction {
  id: string;
  wait(confirmations?: number): Promise<IReceipt>
}

class Transaction implements ITransaction {
  constructor(private readonly __wrapper: IWrapper) {
    this.id = "";
  }

  id: string;
  wait(confirmations?: number): Promise<IReceipt> {
    throw new Error("Method not implemented.");
  }
}

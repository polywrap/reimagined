import { AbiItem, IFunction } from "@polywrap/reim-wrap";
export const findResourceIdForGlobalFunction = (abi: AbiItem[], functionName: string): number => {
  const module = abi.find((abi: any) => abi.name === "Module");

  if (!module) {
    throw "WasmWrapper: Module not found in manifest";
  }

  const resourceId = module.methods.map((x: IFunction) => x.name).indexOf(functionName);
  
  return resourceId;
};

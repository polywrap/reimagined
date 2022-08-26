#!/usr/bin/env node

import { EmbeddedPackage } from "@polywrap/reim-wasm";
import { IPackageLoader } from "@polywrap/reim-loader";
import { IWrapPackage, IWrapInstance } from "@polywrap/reim-wrap";
import { Result } from "@polywrap/result";

import { IUniswap_SimpleMethodArgs } from "./codegen/uniswap/Uniswap";
import { FileSystemLoader } from "./FileSystemLoader";

(async () => {
const loader: IPackageLoader = new FileSystemLoader();

const wrapPackage: IWrapPackage = await loader.load("ens/uniswap.eth");
const wrapper: IWrapInstance = await wrapPackage.createWrapper();

await invokeStatic(wrapper);

await invokeInstance(wrapper);
})();

async function invokeStatic(wrapper: IWrapInstance): Promise<void> {
  console.error("invokeStatic start");
  // ptr or id only needs to be unique per module instance per class name
  // in wasm it can be a ptr in plugins it can just be an auto-increment number
 const result: Result<string, string> = await wrapper.invokeStatic<IUniswap_SimpleMethodArgs, string>(
    "Module", 
    "simpleMethod",
    {
      arg: "Hello"
    } as IUniswap_SimpleMethodArgs
  );
  
  if (!result.ok) {
    console.error("Result error:", result.error);
  }
  
  if (result.ok) {
    console.log("Result ok:", result.value);
  }
}


async function invokeInstance(wrapper: IWrapInstance): Promise<void> {
  console.error("invokeInstance start");
  const instantiateResult: Result<number, string> = await wrapper.instantiate<IUniswap_SimpleMethodArgs>(
    "EthereumProvider", 
    {
      arg: "Ctor args"
    } as IUniswap_SimpleMethodArgs
  );
  
  if (!instantiateResult.ok) {
    console.error("Result error:", instantiateResult.error);
    return;
  }
  
  if (instantiateResult.ok) {
    console.log("Result ok:", instantiateResult.value);
  }

  console.error("invokeInstance start");
 
  const instanceResult: Result<string, string> = await wrapper.invokeInstance<IUniswap_SimpleMethodArgs, string>(
    "EthereumProvider",
    instantiateResult.value, 
    "instanceMethod",
    {
      arg: "Hello instance"
    } as IUniswap_SimpleMethodArgs
  );
  
  if (!instanceResult.ok) {
    console.error("Result error:", instanceResult.error);
  }
  
  if (instanceResult.ok) {
    console.log("Result ok:", instanceResult.value);
  }
}
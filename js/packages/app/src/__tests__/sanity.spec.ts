// import { Result } from "@polywrap/result";
// import { IPackageLoader } from "@polywrap/reim-loader";
// import { IWrapPackage, IWrapInstance} from "@polywrap/reim-wrap";
// import { FileSystemLoader } from "../FileSystemLoader";
// import { IEthereumProvider } from "../codegen/ethereum/EthereumProvider";
// import { EthereumProvider__factory } from "../codegen/ethereum/EthereumProvider__factory";
// import { IUniswap_SimpleMethodArgs } from "../codegen/uniswap/Uniswap";

// jest.setTimeout(200000);

// describe("sanity", () => {
//   test("sanity", async () => {
//     const loader: IPackageLoader = new FileSystemLoader();
    
//     const wrapPackage: IWrapPackage = await loader.load(`${__dirname}/../../../../../wrapper/build`);
//     const wrapper: IWrapInstance = await wrapPackage.createWrapper();

//     const provider: IEthereumProvider = await EthereumProvider__factory.fromWrapper(wrapper, { arg: "0x" });

//     await provider.instanceMethod("1");
//     await provider.instanceMethod("2");
//     await provider.instanceMethod("3");

//     const result = await provider.instanceMethod("45");

//     console.log("result", result);
//     expect(result).toEqual("0x 1 2 3 45");

//     const signer = await provider.getSigner();

//     const address = await signer.getAddress();
//     console.log("address", address);

//     expect(result).toEqual("0x 1 2 3 45");

//     const calc = new Calc();
   
//     await provider.increment(calc);
//     await provider.increment(calc);
//     await provider.increment(calc);
    
//     const calcResult = await provider.increment(calc);
 
//     console.log("calcResult", calcResult);

//     expect(calcResult).toEqual("4");
//   });
// });

// class Calc {
//   count: number = 0;
//   increment(): string {
//     this.count++;
//     return this.count.toString();
//   }
// }

// async function invokeStatic(wrapper: IWrapInstance): Promise<void> {
//   console.log("invokeStatic start");
//   // ptr or id only needs to be unique per module instance per class name
//   // in wasm it can be a ptr in plugins it can just be an auto-increment number
//  const result: Result<string, string> = await wrapper.invokeStatic<IUniswap_SimpleMethodArgs, string>(
//     "Module", 
//     "simpleMethod",
//     {
//       arg: "Hello"
//     } as IUniswap_SimpleMethodArgs
//   );
  
//   if (!result.ok) {
//     console.error("Result error:", result.error);
//   }
  
//   if (result.ok) {
//     console.log("Result ok:", result.value);
//   }
// }


// async function instantiateAndInvokeInstance(wrapper: IWrapInstance): Promise<void> {
//   const className = "EthereumProvider";
//   const classInstancePtr = await instantiate(wrapper, className, "Start");

//   if (!classInstancePtr) {
//     return;
//   }

//   const methodName = "instanceMethod";

//   await invokeInstance(wrapper, className, classInstancePtr, methodName, "1");
//   await invokeInstance(wrapper, className, classInstancePtr, methodName, "2");
//   await invokeInstance(wrapper, className, classInstancePtr, methodName, "3");
//   await invokeInstance(wrapper, className, classInstancePtr, methodName, "4");
//   await invokeInstance(wrapper, className, classInstancePtr, methodName, "sadsadsadsadsasad");
// }

// async function instantiate(wrapper: IWrapInstance, className: string, arg: string): Promise<number | undefined> {
//   console.log("instantiate start");
//   const instantiateResult: Result<number, string> = await wrapper.instantiate<IUniswap_SimpleMethodArgs>(
//     className, 
//     {
//       arg
//     } as IUniswap_SimpleMethodArgs
//   );
  
//   if (!instantiateResult.ok) {
//     console.error("Result error:", instantiateResult.error);
//     return undefined;
//   }
  
//   if (instantiateResult.ok) {
//     console.log("Result ok:", instantiateResult.value);
//     return instantiateResult.value;
//   }
// }

// async function invokeInstance(wrapper: IWrapInstance, className: string, classInstancePtr: number, methodName: string, arg: string): Promise<void> {
//   console.log("invokeInstance start");
 
//   const instanceResult: Result<string, string> = await wrapper.invokeInstance<IUniswap_SimpleMethodArgs, string>(
//     className,
//     classInstancePtr, 
//     methodName,
//     {
//       arg: arg
//     } as IUniswap_SimpleMethodArgs
//   );
  
//   if (!instanceResult.ok) {
//     console.error("Result error:", instanceResult.error);
//   }
  
//   if (instanceResult.ok) {
//     console.log("Result ok:", instanceResult.value);
//   }
// }
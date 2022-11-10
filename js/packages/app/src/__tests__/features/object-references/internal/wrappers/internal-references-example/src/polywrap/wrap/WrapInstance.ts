import { stringify, parse } from "@serial-as/json";
import { bufferToU32, concat, u32ToBuffer } from "../buffer";
import { send } from "../dt";
import { InternalResource } from "../internal/InternalResource";
import { invoke as invokeGlobalFunction } from "../internal/global-functions/invokeGlobalFunction";
import { invokeClassMethod } from "../internal/classes/invokeClassMethod";

export interface IWrapInstance {
  // invokeGlobalFunction<TArgs, TData>(funcId: u32, args: TArgs): TData;
  // invokeStaticMethod<TArgs, TData>(classId: u32, methodId: u32, args: TArgs): TData;
  // invokeInstanceMethod<TArgs, TData>(classId: u32, methodId: u32, instanceReferencePtr: u32, args: TArgs): TData;
  invokeResource(resource: u32, buffer: ArrayBuffer): ArrayBuffer;
}

export abstract class WrapInstance implements IWrapInstance {
  constructor(private readonly internalInstance?: IWrapInstance) {
  }

  abstract invokeResource(resource: u32, buffer: ArrayBuffer): ArrayBuffer;

  // invokeGlobalFunction<TArgs, TData>(funcId: u32, args: TArgs): TData {
  //   const buffer = 
  //     concat(
  //       u32ToBuffer(HostResource.InvokeGlobalFunction),
  //       concat(
  //         u32ToBuffer(funcId),
  //         String.UTF8.encode(stringify<TArgs>(args))
  //       )
  //     );

  //   const result = send(buffer);

  //   return parse<TData>(String.UTF8.decode(result));
  // }

  // invokeStaticMethod<TArgs, TData>(classId: u32, methodId: u32, args: TArgs): TData {
  //   const buffer = 
  //     concat(
  //       u32ToBuffer(HostResource.InvokeClassMethod),
  //       concat(
  //         concat(
  //           u32ToBuffer(classId),
  //           u32ToBuffer(methodId),
  //         ),
  //         String.UTF8.encode(stringify<TArgs>(args))
  //       )
  //     );

  //   const result = send(buffer);

  //   return parse<TData>(String.UTF8.decode(result));
  // }

  // invokeInstanceMethod<TArgs, TData>(classId: u32, methodId: u32, instanceReferencePtr: u32, args: TArgs): TData {
  //   const buffer = 
  //     concat(
  //       u32ToBuffer(HostResource.InvokeClassMethod),
  //       concat(
  //         concat(
  //           concat(
  //             u32ToBuffer(classId),
  //             u32ToBuffer(methodId),
  //           ),
  //           u32ToBuffer(instanceReferencePtr)
  //         ),
  //         String.UTF8.encode(stringify<TArgs>(args))
  //       )
  //     );

  //   const result = send(buffer);

  //   return parse<TData>(String.UTF8.decode(result));
  // }

  onReceive(buffer: ArrayBuffer): ArrayBuffer {
    if(!this.internalInstance) {
      throw new Error("No internal wrap instance provided");
    }

    const resourceId = bufferToU32(buffer);

    const dataBuffer = buffer.slice(4);
  
    return this.internalInstance.invokeResource(resourceId, dataBuffer);
  }
}

export class InternalWrapInstance extends WrapInstance {
  constructor() {
    super();
  }

  invokeResource(resource: u32, buffer: ArrayBuffer): ArrayBuffer {
    switch(resource) {
      case InternalResource.InvokeGlobalFunction: 
        return invokeGlobalFunction(buffer);
      case InternalResource.InvokeClassMethod: 
        return invokeClassMethod(buffer);
      default: 
        throw new Error("Unknown function");
    }
  }
}

export class ExternalWrapInstance extends WrapInstance {
  constructor() {
    super(new InternalWrapInstance());
  }

  invokeResource(resource: u32, buffer: ArrayBuffer): ArrayBuffer {
    const result = send(concat(u32ToBuffer(resource), buffer));

    return result;
  }
}


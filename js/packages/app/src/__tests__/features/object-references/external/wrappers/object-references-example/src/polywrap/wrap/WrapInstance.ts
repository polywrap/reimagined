import { stringify, parse } from "@serial-as/json";
import { concat, u32ToBuffer } from "../buffer";
import { send } from "../dt";
import { HostResource } from "./host-resources/HostResource";

export interface IWrapInterface {
  invokeGlobalFunction<TArgs, TData>(funcId: u32, args: TArgs): TData;
  invokeStaticMethod<TArgs, TData>(classId: u32, methodId: u32, args: TArgs): TData;
  invokeInstanceMethod<TArgs, TData>(classId: u32, methodId: u32, instanceReferencePtr: u32, args: TArgs): TData;
}

export class WrapInstance implements IWrapInterface {
  invokeGlobalFunction<TArgs, TData>(funcId: u32, args: TArgs): TData {
    const buffer = 
      concat(
        u32ToBuffer(HostResource.InvokeGlobalFunction),
        concat(
          u32ToBuffer(funcId),
          String.UTF8.encode(stringify<TArgs>(args))
        )
      );

    const result = send(buffer);

    return parse<TData>(String.UTF8.decode(result));
  }

  invokeStaticMethod<TArgs, TData>(classId: u32, methodId: u32, args: TArgs): TData {
    const buffer = 
      concat(
        u32ToBuffer(HostResource.InvokeClassMethod),
        concat(
          concat(
            u32ToBuffer(classId),
            u32ToBuffer(methodId),
          ),
          String.UTF8.encode(stringify<TArgs>(args))
        )
      );

    const result = send(buffer);

    return parse<TData>(String.UTF8.decode(result));
  }

  invokeInstanceMethod<TArgs, TData>(classId: u32, methodId: u32, instanceReferencePtr: u32, args: TArgs): TData {
    const buffer = 
      concat(
        u32ToBuffer(HostResource.InvokeClassMethod),
        concat(
          concat(
            concat(
              u32ToBuffer(classId),
              u32ToBuffer(methodId),
            ),
            u32ToBuffer(instanceReferencePtr)
          ),
          String.UTF8.encode(stringify<TArgs>(args))
        )
      );

    const result = send(buffer);

    return parse<TData>(String.UTF8.decode(result));
  }
}

export let wrapInstance = new WrapInstance();

export class Host {
  static connect(instance: WrapInstance): void {
    wrapInstance = instance;
  }

  static export(): void {
  }
}

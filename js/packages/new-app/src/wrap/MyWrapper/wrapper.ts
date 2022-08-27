import { IWrapInstance} from "@polywrap/reim-new-wrap";

export type simpleMethodFn = (
  arg: string
) => Promise<string>;
export type anotherMethodFn = (
  arg: string
) => Promise<string>;

export class MyWrapper__factory {
  static async fromWrapper(wrapper: IWrapInstance): Promise<
  {
    simpleMethod: simpleMethodFn
    anotherMethod: anotherMethodFn,
  }> {
    return {
      simpleMethod: async (
        arg: string
      ): Promise<string> => {
        const result = await wrapper.invokeGlobalFunction<unknown, string>(
          MyWrapper.__className,
          "simpleMethod",
          {
            arg
          }
        );

        if (!result.ok) {
          throw result.error;
        }

        return result.value;
      }
      anotherMethod: async (
        arg: string
      ): Promise<string> => {
        const result = await wrapper.invokeGlobalFunction<unknown, string>(
          MyWrapper.__className,
          "anotherMethod",
          {
            arg
          }
        );

        if (!result.ok) {
          throw result.error;
        }

        return result.value;
      },
    };
  }
}

export class MyWrapper {
  constructor(public readonly __wrapper: IWrapInstance) {
  }

  public static __className: string = "MyWrapper";
}

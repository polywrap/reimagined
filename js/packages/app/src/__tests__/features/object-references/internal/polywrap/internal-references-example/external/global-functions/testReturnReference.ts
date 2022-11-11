import { IObjectReference } from "../../IObjectReference";
import { IWrapInstance } from "../../wrap/WrapInstance";
import { WrapModule } from "../../wrap/WrapModule";
import { TestInternalClass } from "../classes";

export const createTestReturnReference = (instance: IWrapInstance) => {
  return async (arg: string): Promise<TestInternalClass> => {
    return testReturnReferenceFromInstance(
      instance, 
      arg
    );
  };
};

export const testReturnReference = (
  arg: string
) => {
  return testReturnReferenceFromInstance(
    WrapModule.wrapInstance, 
    arg
  );
};

export const testReturnReferenceFromInstance = async (
  instance: IWrapInstance | null, 
  arg: string
): Promise<TestInternalClass> => {
  if (instance == null) {
    throw new Error("connect() or import() must be called before using this module");
  }

  const object = await instance.invokeGlobalFunction<Args, IObjectReference>(
    "testReturnReference", 
    { 
      arg 
    }
  );

  return new TestInternalClass(instance, object.__objectReferencePtr);
};

type Args = {
  arg: string;
};

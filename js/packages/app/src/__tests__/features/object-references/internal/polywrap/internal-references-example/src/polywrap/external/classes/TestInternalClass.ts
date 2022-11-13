import { IExternalWrapInstance, BaseTypeSerialization, u32ToBuffer, concat } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from "../../dt/ExternalResource";
import { WrapModule } from "../module/WrapModule";
import { TestInternalClassWrapped } from '../../wrapped';


export const create = (instance: IExternalWrapInstance) => {
  return new TestInternalClassImport(instance);
};

export class TestInternalClassImport {
  constructor(private readonly wrapInstance: IExternalWrapInstance) {}

  
  async create(
    arg: string,
  ): Promise<TestInternalClass> {
    const args = new CreateArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.TestInternalClass),
      u32ToBuffer(WrapManifest.External.Classes.TestInternalClassMethod.Create),
      CreateArgsWrapped.serialize(args),
    ]);

    const result = await this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    return TestInternalClassWrapped.deserialize(result, this.wrapInstance);
      }
      
}

export class TestInternalClass {
  constructor(
    private readonly __referencePtr: number,
    private readonly __wrapInstance: IExternalWrapInstance,
  ) {}

  
  static create(
    arg: string,
  ): Promise<TestInternalClass> {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new TestInternalClassImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .create(
        arg,
      );
  }
        
  async testInstanceMethod(
    arg: string,
  ): Promise<string> {
    if (this.__wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    const args = new TestInstanceMethodArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.TestInternalClass),
      u32ToBuffer(WrapManifest.External.Classes.TestInternalClassMethod.TestInstanceMethod),
      u32ToBuffer(this.__referencePtr),
      TestInstanceMethodArgsWrapped.serialize(args),
    ]);

    const result = await this.__wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
  
}

class CreateArgs {
  constructor(
    public arg: string,
     
  ) {
  }
}

class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: CreateArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        CreateArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: CreateArgs): CreateArgsWrapped {
    return new CreateArgsWrapped(
            
      value.arg,
      
    );
  }
}
class TestInstanceMethodArgs {
  constructor(
    public arg: string,
     
  ) {
  }
}

class TestInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestInstanceMethodArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestInstanceMethodArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestInstanceMethodArgs): TestInstanceMethodArgsWrapped {
    return new TestInstanceMethodArgsWrapped(
            
      value.arg,
      
    );
  }
}

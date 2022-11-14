import { stringify } from "@serial-as/json";
import { IExternalWrapInstance, BaseTypeSerialization, u32ToBuffer, concat } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from "../../dt/ExternalResource";
import { WrapModule } from "../module/WrapModule";
import { TestExternalClassWrapped } from '../../wrapped';


//export const create = (instance: IExternalWrapInstance) => {
//  return new TestExternalClassImport(instance);
//};

export class TestExternalClassImport {
  constructor(private readonly wrapInstance: IExternalWrapInstance) {}

  
  create(
    arg: string,
  ): TestExternalClass {
    const args = new CreateArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.TestExternalClass),
      u32ToBuffer(WrapManifest.External.Classes.TestExternalClassMethod.Create),
      CreateArgsWrapped.serialize(args),
    ]);

    const result = this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    return TestExternalClassWrapped.deserialize(result, this.wrapInstance);
      }
        
  testStaticMethod(
    arg: string,
  ): string {
    const args = new TestStaticMethodArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.TestExternalClass),
      u32ToBuffer(WrapManifest.External.Classes.TestExternalClassMethod.TestStaticMethod),
      TestStaticMethodArgsWrapped.serialize(args),
    ]);

    const result = this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
  
}

export class TestExternalClass {
  constructor(
    private readonly __referencePtr: u32,
    private readonly __wrapInstance: IExternalWrapInstance,
  ) {}

  
  static create(
    arg: string,
  ): TestExternalClass {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new TestExternalClassImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .create(
        arg,
      );
  }
        
  testInstanceMethod(
    arg: string,
  ): string {
    if (this.__wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    const args = new TestInstanceMethodArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.TestExternalClass),
      u32ToBuffer(WrapManifest.External.Classes.TestExternalClassMethod.TestInstanceMethod),
      u32ToBuffer(this.__referencePtr),
      TestInstanceMethodArgsWrapped.serialize(args),
    ]);

    const result = this.__wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
    
  static testStaticMethod(
    arg: string,
  ): string {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new TestExternalClassImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .testStaticMethod(
        arg,
      );
  }
    
}

class CreateArgs {
  constructor(
    public arg: string,
     
  ) {
  }
}

@serializable
class CreateArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: CreateArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<CreateArgsWrapped>(
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

@serializable
class TestInstanceMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestInstanceMethodArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestInstanceMethodArgsWrapped>(
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
class TestStaticMethodArgs {
  constructor(
    public arg: string,
     
  ) {
  }
}

@serializable
class TestStaticMethodArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static serialize(value: TestStaticMethodArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<TestStaticMethodArgsWrapped>(
        TestStaticMethodArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestStaticMethodArgs): TestStaticMethodArgsWrapped {
    return new TestStaticMethodArgsWrapped(
            
      value.arg,
      
    );
  }
}

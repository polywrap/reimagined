import { IExternalWrapInstance, BaseTypeSerialization, u32ToBuffer, concat } from "@nerfzael/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from "../../dt/ExternalResource";
import { WrapModule } from "../module/WrapModule";
import { TestObjectGetterWrapped } from '../../wrapped';
import { TestExternalClassWrapped } from "../../wrapped";

import { TestExternalClass } from "../../..";



export const create = (instance: IExternalWrapInstance) => {
  return new TestObjectGetterImport(instance);
};

export class TestObjectGetterImport {
  constructor(private readonly wrapInstance: IExternalWrapInstance) {}

  
  create(
    arg: string,
  ): TestObjectGetter {
    const args = new CreateArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Classes.TestObjectGetterMethod.Create),
      CreateArgsWrapped.serialize(args),
    ]);

    const result = this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    return TestObjectGetterWrapped.deserialize(result, this.wrapInstance);
      }
        
  testStaticReceiveReference(
    arg: TestExternalClass,
  ): string {
    const args = new TestStaticReceiveReferenceArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Classes.TestObjectGetterMethod.TestStaticReceiveReference),
      TestStaticReceiveReferenceArgsWrapped.serialize(args),
    ]);

    const result = this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
  
}

export class TestObjectGetter {
  constructor(
    private readonly __referencePtr: number,
    private readonly __wrapInstance: IExternalWrapInstance,
  ) {}

  
  static create(
    arg: string,
  ): TestObjectGetter {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new TestObjectGetterImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .create(
        arg,
      );
  }
        
  testInstanceReceiveReference(
    arg: TestExternalClass,
  ): string {
    if (this.__wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    const args = new TestInstanceReceiveReferenceArgs( 
      arg,
       
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Classes.TestObjectGetterMethod.TestInstanceReceiveReference),
      u32ToBuffer(this.__referencePtr),
      TestInstanceReceiveReferenceArgsWrapped.serialize(args),
    ]);

    const result = this.__wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
    
  static testStaticReceiveReference(
    arg: TestExternalClass,
  ): string {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new TestObjectGetterImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .testStaticReceiveReference(
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
class TestInstanceReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
     
  ) {
  }
}

@serializable
class TestInstanceReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static serialize(value: TestInstanceReceiveReferenceArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestInstanceReceiveReferenceArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestInstanceReceiveReferenceArgs): TestInstanceReceiveReferenceArgsWrapped {
    return new TestInstanceReceiveReferenceArgsWrapped(
      
      TestExternalClassWrapped.mapToSerializable(value.arg),
            
    );
  }
}
class TestStaticReceiveReferenceArgs {
  constructor(
    public arg: TestExternalClass,
     
  ) {
  }
}

@serializable
class TestStaticReceiveReferenceArgsWrapped {
  constructor(
    public arg: TestExternalClassWrapped,
  ) {
  }

  static serialize(value: TestStaticReceiveReferenceArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        TestStaticReceiveReferenceArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: TestStaticReceiveReferenceArgs): TestStaticReceiveReferenceArgsWrapped {
    return new TestStaticReceiveReferenceArgsWrapped(
      
      TestExternalClassWrapped.mapToSerializable(value.arg),
            
    );
  }
}

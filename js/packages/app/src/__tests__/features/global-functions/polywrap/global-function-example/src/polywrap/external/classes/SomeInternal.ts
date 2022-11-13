import { IExternalWrapInstance, BaseTypeSerialization, u32ToBuffer, concat } from "@polywrap/reim-wrap-js";
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from "../../dt/ExternalResource";
import { WrapModule } from "../module/WrapModule";
import { SomeInternalWrapped } from '../../wrapped';


export const create = (instance: IExternalWrapInstance) => {
  return new SomeInternalImport(instance);
};

export class SomeInternalImport {
  constructor(private readonly wrapInstance: IExternalWrapInstance) {}

  
  async create(
  ): Promise<SomeInternal> {
    const args = new CreateArgs( 
 
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.SomeInternal),
      u32ToBuffer(WrapManifest.External.Classes.SomeInternalMethod.Create),
      CreateArgsWrapped.serialize(args),
    ]);

    const result = await this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    return SomeInternalWrapped.deserialize(result, this.wrapInstance);
      }
      
}

export class SomeInternal {
  constructor(
    private readonly __referencePtr: number,
    private readonly __wrapInstance: IExternalWrapInstance,
  ) {}

  
  static create(
  ): Promise<SomeInternal> {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new SomeInternalImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .create(
      );
  }
        
  async getValue(
  ): Promise<string> {
    if (this.__wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    const args = new GetValueArgs( 
 
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.SomeInternal),
      u32ToBuffer(WrapManifest.External.Classes.SomeInternalMethod.GetValue),
      u32ToBuffer(this.__referencePtr),
      GetValueArgsWrapped.serialize(args),
    ]);

    const result = await this.__wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
  
}

class CreateArgs {
  constructor(
 
  ) {
  }
}

class CreateArgsWrapped {
  constructor(
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

    );
  }
}
class GetValueArgs {
  constructor(
 
  ) {
  }
}

class GetValueArgsWrapped {
  constructor(
  ) {
  }

  static serialize(value: GetValueArgs): Uint8Array {
    return new TextEncoder().encode(
      JSON.stringify(
        GetValueArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: GetValueArgs): GetValueArgsWrapped {
    return new GetValueArgsWrapped(

    );
  }
}

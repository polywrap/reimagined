import { stringify } from "@serial-as/json";
import { IExternalWrapInstance, BaseTypeSerialization, u32ToBuffer, concat } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { ExternalResource } from "../../dt/ExternalResource";
import { WrapModule } from "../module/WrapModule";
import { SomeExternalWrapped } from '../../wrapped';


//export const create = (instance: IExternalWrapInstance) => {
//  return new SomeExternalImport(instance);
//};

export class SomeExternalImport {
  constructor(private readonly wrapInstance: IExternalWrapInstance) {}

  
  create(
  ): SomeExternal {
    const args = new CreateArgs( 
 
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.SomeExternal),
      u32ToBuffer(WrapManifest.External.Classes.SomeExternalMethod.Create),
      CreateArgsWrapped.serialize(args),
    ]);

    const result = this.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    return SomeExternalWrapped.deserialize(result, this.wrapInstance);
      }
      
}

export class SomeExternal {
  constructor(
    private readonly __referencePtr: u32,
    private readonly __wrapInstance: IExternalWrapInstance,
  ) {}

  
  static create(
  ): SomeExternal {
    if (WrapModule.wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    return new SomeExternalImport(WrapModule.wrapInstance as IExternalWrapInstance)
      .create(
      );
  }
        
  getValue(
  ): string {
    if (this.__wrapInstance == null) {
      throw new Error("connect() or import() must be called before using this module");
    }

    const args = new GetValueArgs( 
 
    );

    const buffer = concat([
      u32ToBuffer(WrapManifest.External.Class.SomeExternal),
      u32ToBuffer(WrapManifest.External.Classes.SomeExternalMethod.GetValue),
      u32ToBuffer(this.__referencePtr),
      GetValueArgsWrapped.serialize(args),
    ]);

    const result = this.__wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer);

    
    return BaseTypeSerialization.deserialize<string>(result);
  }
  
}

class CreateArgs {
  constructor(
 
  ) {
  }
}

@serializable
class CreateArgsWrapped {
  constructor(
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

    );
  }
}
class GetValueArgs {
  constructor(
 
  ) {
  }
}

@serializable
class GetValueArgsWrapped {
  constructor(
  ) {
  }

  static serialize(value: GetValueArgs): ArrayBuffer {
    return String.UTF8.encode(
      stringify<GetValueArgsWrapped>(
        GetValueArgsWrapped.mapToSerializable(value)
      )
    );
  }

  static mapToSerializable(value: GetValueArgs): GetValueArgsWrapped {
    return new GetValueArgsWrapped(

    );
  }
}

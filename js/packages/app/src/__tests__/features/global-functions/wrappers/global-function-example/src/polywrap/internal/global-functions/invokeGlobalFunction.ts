import { parse } from '@serial-as/json'
import { bufferToU32, BaseTypeSerialization, IExternalWrapInstance } from "@nerfzael/reim-wrap-as";
import { WrapManifest } from '../../WrapManifest';
import { 
  
  stringArgFunction,
    
  objectArgFunction,
    
  objectResultFunction,
    
  nestedObjectArgFunction,
    
  nestedObjectResultFunction,
   
} from "../../..";

import { TestObject } from "../../..";

import { ObjectWithChildren } from "../../..";


export function invoke(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer {
  const funcId = bufferToU32(buffer);
  const dataBuffer = buffer.slice(4);

  switch (funcId) {
    
    case WrapManifest.Internal.GlobalFunction.StringArgFunction:
        return invokeStringArgFunctionWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.ObjectArgFunction:
        return invokeObjectArgFunctionWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.ObjectResultFunction:
        return invokeObjectResultFunctionWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.NestedObjectArgFunction:
        return invokeNestedObjectArgFunctionWrapped(dataBuffer, wrapInstance);
        
    case WrapManifest.Internal.GlobalFunction.NestedObjectResultFunction:
        return invokeNestedObjectResultFunctionWrapped(dataBuffer, wrapInstance);
    
    default:
      throw new Error("Unknown function/method: " + funcId.toString());
  }
}

const invokeStringArgFunctionWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = StringArgFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = stringArgFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class StringArgFunctionArgs {
  constructor(
    public arg: string,
  ) {
  }
}

@serializable
class StringArgFunctionArgsWrapped {
  constructor(
    public arg: string,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): StringArgFunctionArgs {
    const args = parse<StringArgFunctionArgsWrapped>(String.UTF8.decode(buffer));
  
    return new StringArgFunctionArgs(
            
      args.arg,
      
    );
  }  
}
const invokeObjectArgFunctionWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = ObjectArgFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = objectArgFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class ObjectArgFunctionArgs {
  constructor(
    public arg: TestObject,
  ) {
  }
}

@serializable
class ObjectArgFunctionArgsWrapped {
  constructor(
    public arg: TestObject,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ObjectArgFunctionArgs {
    const args = parse<ObjectArgFunctionArgsWrapped>(String.UTF8.decode(buffer));
  
    return new ObjectArgFunctionArgs(
            
      args.arg,
      
    );
  }  
}
const invokeObjectResultFunctionWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = ObjectResultFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = objectResultFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<TestObject>(result);
};

class ObjectResultFunctionArgs {
  constructor(
    public arg: TestObject,
  ) {
  }
}

@serializable
class ObjectResultFunctionArgsWrapped {
  constructor(
    public arg: TestObject,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ObjectResultFunctionArgs {
    const args = parse<ObjectResultFunctionArgsWrapped>(String.UTF8.decode(buffer));
  
    return new ObjectResultFunctionArgs(
            
      args.arg,
      
    );
  }  
}
const invokeNestedObjectArgFunctionWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = NestedObjectArgFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = nestedObjectArgFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<string>(result);
};

class NestedObjectArgFunctionArgs {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }
}

@serializable
class NestedObjectArgFunctionArgsWrapped {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): NestedObjectArgFunctionArgs {
    const args = parse<NestedObjectArgFunctionArgsWrapped>(String.UTF8.decode(buffer));
  
    return new NestedObjectArgFunctionArgs(
            
      args.arg,
      
    );
  }  
}
const invokeNestedObjectResultFunctionWrapped = (buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): ArrayBuffer => {
  const argsBuffer = buffer;

  const args = NestedObjectResultFunctionArgsWrapped.deserialize(argsBuffer, wrapInstance);

  const result = nestedObjectResultFunction(
    args.arg,
  );

  
  return BaseTypeSerialization.serialize<ObjectWithChildren>(result);
};

class NestedObjectResultFunctionArgs {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }
}

@serializable
class NestedObjectResultFunctionArgsWrapped {
  constructor(
    public arg: ObjectWithChildren,
  ) {
  }

  static deserialize(buffer: ArrayBuffer, wrapInstance: IExternalWrapInstance): NestedObjectResultFunctionArgs {
    const args = parse<NestedObjectResultFunctionArgsWrapped>(String.UTF8.decode(buffer));
  
    return new NestedObjectResultFunctionArgs(
            
      args.arg,
      
    );
  }  
}


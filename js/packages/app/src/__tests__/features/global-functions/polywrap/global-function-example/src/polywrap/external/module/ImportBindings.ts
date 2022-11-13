
import { TestObject } from "../../..";

import { ObjectWithChildren } from "../../..";

import { TestObject2 } from "../../..";


export class ImportBindings {
  constructor(
    
    public stringArgFunction: (
      arg: string,
    ) => Promise<string>,
        
    public objectArgFunction: (
      arg: TestObject,
    ) => Promise<string>,
        
    public objectResultFunction: (
      arg: TestObject,
    ) => Promise<TestObject>,
        
    public nestedObjectArgFunction: (
      arg: ObjectWithChildren,
    ) => Promise<string>,
        
    public nestedObjectResultFunction: (
      arg: ObjectWithChildren,
    ) => Promise<ObjectWithChildren>,
    
                        
  ) {
  }
}

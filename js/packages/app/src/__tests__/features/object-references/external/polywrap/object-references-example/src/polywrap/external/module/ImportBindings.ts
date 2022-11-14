import { TestObjectGetterImport } from "../classes/TestObjectGetter";
import { TestObjectGetter } from "../classes";


import { TestExternalClass } from "../../..";



export class ImportBindings {
  constructor(
    
    public testReceiveReference: (
      arg: TestExternalClass,
    ) => Promise<string>,
        
    public testInvokeExternalGlobalFunction: (
      arg: string,
    ) => Promise<string>,
        
    public testInvokeExternalStaticMethod: (
      arg: string,
    ) => Promise<string>,
        
    public testInvokeExternalInstanceMethod: (
      arg: string,
    ) => Promise<string>,
            
    
    public TestObjectGetter: TestObjectGetterImport,
            
  ) {
  }
}

import { TestInternalClassImport } from "../classes/TestInternalClass";
import { TestInternalClass } from "../classes";

import { TestObjectGetterImport } from "../classes/TestObjectGetter";
import { TestObjectGetter } from "../classes";



export class ImportBindings {
  constructor(
    
    public testReturnReference: (
      arg: string,
    ) => Promise<TestInternalClass>,
    
    
    public TestInternalClass: TestInternalClassImport,
        
    public TestObjectGetter: TestObjectGetterImport,
    
  ) {
  }
}

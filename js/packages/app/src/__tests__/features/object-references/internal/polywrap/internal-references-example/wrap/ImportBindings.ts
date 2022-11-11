import { TestInternalClass, TestInternalClassImport } from "../external/classes";


export class ImportBindings {
  constructor(
    public testReturnReference: (
      arg: string
    ) => Promise<TestInternalClass>,
    public TestInternalClass: TestInternalClassImport,
    public TestObjectGetter: {
      new(arg: string): TestInternalClass;
    }
  ) {
  }
}

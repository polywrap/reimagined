export class TestExternalClass {
  constructor(public arg: string) {
  }

  static async create(arg: string): Promise<TestExternalClass> {
    return new TestExternalClass(arg);
  }

  async testInstanceMethod(arg: string): Promise<string> {
    return arg + " instance";
  }
  static async testStaticMethod(arg: string): Promise<string> {
    return arg + " static";
  }
}

export const testExternalGlobalFunction = async (arg: string): Promise<string> => {
  return arg + " function";
};

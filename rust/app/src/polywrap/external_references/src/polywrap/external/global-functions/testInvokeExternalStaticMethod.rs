use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use dt::{ ExternalResource };
use external_module::{ WrapModule };
use wrapped::{ testInvokeExternalStaticMethodWrapped };


pub async fn testInvokeExternalStaticMethod(
  arg: string,
) -> string {
  testInvokeExternalStaticMethodFromInstance(
    WrapModule.wrapInstance,
    arg,
  )
};

pub fn create(instance: dyn ExternalWrapModule) {
  |
    arg: string,
  | {
    testInvokeExternalStaticMethodFromInstance(
      instance, 
      arg,
    )
  }
}

pub async fn testInvokeExternalStaticMethodFromInstance (
  instance: Option<ExternalWrapModule>, 
  arg: string,
) -> string {
  if instance.is_none() {
    panic!("connect() or import() must be called before using this module");
  }

  let args = TestInvokeExternalStaticMethodArgs.new(
    arg,
  );

  let buffer = [
    WrapManifest.External.GlobalFunction.TestInvokeExternalStaticMethod.to_be_bytes(),
    TestInvokeExternalStaticMethodArgsWrapped.serialize(args),
  ].concat();

  let result = instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer).await;

  
  BaseTypeSerialization.deserialize<string>(result)
}

struct TestInvokeExternalStaticMethodArgsWrapped {
    pub arg: string,
}
impl TestInvokeExternalStaticMethodArgsWrapped {
    pub fn new(
      arg: string,
    ) -> TestInvokeExternalStaticMethodArgsWrapped {
      TestInvokeExternalStaticMethodArgsWrapped {
        arg,
      }
    }

    pub fn serialize(value: TestInvokeExternalStaticMethodArgs) -> Vec<u8> {
        json!(
            TestInvokeExternalStaticMethodArgsWrapped.mapToSerializable(value)
        ).as_bytes()
    }

    pub fn mapToSerializable(value: TestInvokeExternalStaticMethodArgs) -> TestInvokeExternalStaticMethodArgsWrapped {
        TestInvokeExternalStaticMethodArgsWrapped.new(
                        
            value.arg,
            
        )
    }
}

struct TestInvokeExternalStaticMethodArgs {
    pub arg: string,
}

impl TestInvokeExternalStaticMethodArgs {
  pub fn new(
    arg: string,
  ) -> TestInvokeExternalStaticMethodArgs {
    TestInvokeExternalStaticMethodArgs.new (
      arg,
    )
  }
}

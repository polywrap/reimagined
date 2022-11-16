use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use dt::{ ExternalResource };
use external_module::{ WrapModule };
use wrapped::{ testInvokeExternalGlobalFunctionWrapped };


pub async fn testInvokeExternalGlobalFunction(
  arg: string,
) -> string {
  testInvokeExternalGlobalFunctionFromInstance(
    WrapModule.wrapInstance,
    arg,
  )
};

pub fn create(instance: dyn ExternalWrapModule) {
  |
    arg: string,
  | {
    testInvokeExternalGlobalFunctionFromInstance(
      instance, 
      arg,
    )
  }
}

pub async fn testInvokeExternalGlobalFunctionFromInstance (
  instance: Option<ExternalWrapModule>, 
  arg: string,
) -> string {
  if instance.is_none() {
    panic!("connect() or import() must be called before using this module");
  }

  let args = TestInvokeExternalGlobalFunctionArgs.new(
    arg,
  );

  let buffer = [
    WrapManifest.External.GlobalFunction.TestInvokeExternalGlobalFunction.to_be_bytes(),
    TestInvokeExternalGlobalFunctionArgsWrapped.serialize(args),
  ].concat();

  let result = instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer).await;

  
  BaseTypeSerialization.deserialize<string>(result)
}

struct TestInvokeExternalGlobalFunctionArgsWrapped {
    pub arg: string,
}
impl TestInvokeExternalGlobalFunctionArgsWrapped {
    pub fn new(
      arg: string,
    ) -> TestInvokeExternalGlobalFunctionArgsWrapped {
      TestInvokeExternalGlobalFunctionArgsWrapped {
        arg,
      }
    }

    pub fn serialize(value: TestInvokeExternalGlobalFunctionArgs) -> Vec<u8> {
        json!(
            TestInvokeExternalGlobalFunctionArgsWrapped.mapToSerializable(value)
        ).as_bytes()
    }

    pub fn mapToSerializable(value: TestInvokeExternalGlobalFunctionArgs) -> TestInvokeExternalGlobalFunctionArgsWrapped {
        TestInvokeExternalGlobalFunctionArgsWrapped.new(
                        
            value.arg,
            
        )
    }
}

struct TestInvokeExternalGlobalFunctionArgs {
    pub arg: string,
}

impl TestInvokeExternalGlobalFunctionArgs {
  pub fn new(
    arg: string,
  ) -> TestInvokeExternalGlobalFunctionArgs {
    TestInvokeExternalGlobalFunctionArgs.new (
      arg,
    )
  }
}

use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use dt::{ ExternalResource };
use external_module::{ WrapModule };
use wrapped::{ testInvokeExternalInstanceMethodWrapped };


pub async fn testInvokeExternalInstanceMethod(
  arg: string,
) -> string {
  testInvokeExternalInstanceMethodFromInstance(
    WrapModule.wrapInstance,
    arg,
  )
};

pub fn create(instance: dyn ExternalWrapModule) {
  |
    arg: string,
  | {
    testInvokeExternalInstanceMethodFromInstance(
      instance, 
      arg,
    )
  }
}

pub async fn testInvokeExternalInstanceMethodFromInstance (
  instance: Option<ExternalWrapModule>, 
  arg: string,
) -> string {
  if instance.is_none() {
    panic!("connect() or import() must be called before using this module");
  }

  let args = TestInvokeExternalInstanceMethodArgs.new(
    arg,
  );

  let buffer = [
    WrapManifest.External.GlobalFunction.TestInvokeExternalInstanceMethod.to_be_bytes(),
    TestInvokeExternalInstanceMethodArgsWrapped.serialize(args),
  ].concat();

  let result = instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer).await;

  
  BaseTypeSerialization.deserialize<string>(result)
}

struct TestInvokeExternalInstanceMethodArgsWrapped {
    pub arg: string,
}
impl TestInvokeExternalInstanceMethodArgsWrapped {
    pub fn new(
      arg: string,
    ) -> TestInvokeExternalInstanceMethodArgsWrapped {
      TestInvokeExternalInstanceMethodArgsWrapped {
        arg,
      }
    }

    pub fn serialize(value: TestInvokeExternalInstanceMethodArgs) -> Vec<u8> {
        json!(
            TestInvokeExternalInstanceMethodArgsWrapped.mapToSerializable(value)
        ).as_bytes()
    }

    pub fn mapToSerializable(value: TestInvokeExternalInstanceMethodArgs) -> TestInvokeExternalInstanceMethodArgsWrapped {
        TestInvokeExternalInstanceMethodArgsWrapped.new(
                        
            value.arg,
            
        )
    }
}

struct TestInvokeExternalInstanceMethodArgs {
    pub arg: string,
}

impl TestInvokeExternalInstanceMethodArgs {
  pub fn new(
    arg: string,
  ) -> TestInvokeExternalInstanceMethodArgs {
    TestInvokeExternalInstanceMethodArgs.new (
      arg,
    )
  }
}

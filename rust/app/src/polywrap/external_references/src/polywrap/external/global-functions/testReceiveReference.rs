use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use dt::{ ExternalResource };
use external_module::{ WrapModule };
use wrapped::{ testReceiveReferenceWrapped };
use wrapped::{ TestExternalClassWrapped };

use crate::{ TestExternalClass };



pub async fn testReceiveReference(
  arg: TestExternalClass,
) -> string {
  testReceiveReferenceFromInstance(
    WrapModule.wrapInstance,
    arg,
  )
};

pub fn create(instance: dyn ExternalWrapModule) {
  |
    arg: TestExternalClass,
  | {
    testReceiveReferenceFromInstance(
      instance, 
      arg,
    )
  }
}

pub async fn testReceiveReferenceFromInstance (
  instance: Option<ExternalWrapModule>, 
  arg: TestExternalClass,
) -> string {
  if instance.is_none() {
    panic!("connect() or import() must be called before using this module");
  }

  let args = TestReceiveReferenceArgs.new(
    arg,
  );

  let buffer = [
    WrapManifest.External.GlobalFunction.TestReceiveReference.to_be_bytes(),
    TestReceiveReferenceArgsWrapped.serialize(args),
  ].concat();

  let result = instance.invokeResource(ExternalResource.InvokeGlobalFunction, buffer).await;

  
  BaseTypeSerialization.deserialize<string>(result)
}

struct TestReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}
impl TestReceiveReferenceArgsWrapped {
    pub fn new(
      arg: TestExternalClass,
    ) -> TestReceiveReferenceArgsWrapped {
      TestReceiveReferenceArgsWrapped {
        arg,
      }
    }

    pub fn serialize(value: TestReceiveReferenceArgs) -> Vec<u8> {
        json!(
            TestReceiveReferenceArgsWrapped.mapToSerializable(value)
        ).as_bytes()
    }

    pub fn mapToSerializable(value: TestReceiveReferenceArgs) -> TestReceiveReferenceArgsWrapped {
        TestReceiveReferenceArgsWrapped.new(
            
            TestExternalClassWrapped.mapToSerializable(value.arg),
                        
        )
    }
}

struct TestReceiveReferenceArgs {
    pub arg: TestExternalClass,
}

impl TestReceiveReferenceArgs {
  pub fn new(
    arg: TestExternalClass,
  ) -> TestReceiveReferenceArgs {
    TestReceiveReferenceArgs.new (
      arg,
    )
  }
}

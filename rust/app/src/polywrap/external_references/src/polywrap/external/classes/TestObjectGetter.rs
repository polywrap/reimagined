use reim_wrap::{ ExternalWrapModule };
use module::{ WrapManifest };
use dt::{ ExternalResource };
use external_module::{ WrapModule };
use wrapped::{ TestObjectGetterWrapped };
use wrapped::{ TestExternalClassWrapped };

use crate::TestExternalClass;



pub fn create(instance: &dyn ExternalWrapModule) -> TestObjectGetterImport {
    TestObjectGetterImport.new(instance)
}

pub struct TestObjectGetterImport {
    instance: Box<dyn ExternalWrapModule>,
}

impl TestObjectGetterImport {
    pub fn new(instance: &dyn ExternalWrapModule) -> TestObjectGetterImport {
        TestObjectGetterImport {
            instance: instance.clone_box(),
        }
    }

    
    pub async fn create(
        &self,
        arg: string,
    ) -> TestObjectGetter {
        let args = CreateArgs.new( 
            arg,
             
        );

        let buffer = [
            WrapManifest.External.Class.TestObjectGetter.to_be_bytes(),
            WrapManifest.External.Classes.TestObjectGetterMethod.Create.to_be_bytes(),
            CreateArgsWrapped.serialize(args),
        ].concat();

        let result = self.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer).await;

        TestObjectGetterWrapped.deserialize(result, this.wrapInstance)
            }
                
    pub async fn testStaticReceiveReference(
        &self,
        arg: TestExternalClass,
    ) -> string {
        let args = TestStaticReceiveReferenceArgs.new( 
            arg,
             
        );

        let buffer = [
            WrapManifest.External.Class.TestObjectGetter.to_be_bytes(),
            WrapManifest.External.Classes.TestObjectGetterMethod.TestStaticReceiveReference.to_be_bytes(),
            TestStaticReceiveReferenceArgsWrapped.serialize(args),
        ].concat();

        let result = self.wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer).await;

        
        BaseTypeSerialization.deserialize<string>(result)
    }
    
}

struct TestObjectGetter {
    __referencePtr: u32,
    __wrapInstance: ExternalWrapModule,
}

impl TestObjectGetter {
  
  pub async fn create(
    arg: string,
  ) -> TestObjectGetter {
    if WrapModule.wrapInstance.is_none() {
      panic!("connect() or import() must be called before using this module");
    }

    TestObjectGetterImport.new(WrapModule.wrapInstance.unwrap())
      .create(
        arg,
    )
  }
        
  pub async fn testInstanceReceiveReference(
    &self,
    arg: TestExternalClass,
  ) -> string {
    if self.__wrapInstance.is_none() {
      panic!("connect() or import() must be called before using this module");
    }

    let args = TestInstanceReceiveReferenceArgs.new( 
      arg,
       
    );

    let buffer = [
      WrapManifest.External.Class.TestObjectGetter.to_be_bytes(),
      WrapManifest.External.Classes.TestObjectGetterMethod.TestInstanceReceiveReference.to_be_bytes(),
      this.__referencePtr.to_be_bytes(),
      TestInstanceReceiveReferenceArgsWrapped.serialize(args),
    ].concat();

    let result = self.__wrapInstance.invokeResource(ExternalResource.InvokeClassMethod, buffer).await;

    
    BaseTypeSerialization.deserialize<string>(result)
  }
    
  pub async fn testStaticReceiveReference(
    arg: TestExternalClass,
  ) -> string {
    if WrapModule.wrapInstance.is_none() {
      panic!("connect() or import() must be called before using this module");
    }

    TestObjectGetterImport.new(WrapModule.wrapInstance.unwrap())
      .testStaticReceiveReference(
        arg,
    )
  }
    
}

struct CreateArgs {
    pub arg: string,
     
}

impl CreateArgs {
  pub fn new(
    arg: string,
     
  ) -> Self {
    CreateArgs {
      arg: arg,
       
    }
  }
}

struct CreateArgsWrapped {
    pub arg: string,
}

impl CreateArgsWrapped {
  pub fn new(
    arg: string,
  ) -> Self {
    CreateArgsWrapped {
      arg: arg,
    }
  }

  pub fn serialize(value: CreateArgs) -> Vec<u8> {
    json!(
        CreateArgsWrapped.map_to_serializable(value)
    ).as_bytes()
  }

  pub fn map_to_serializable(value: CreateArgs) -> CreateArgsWrapped {
    CreateArgsWrapped.new(
            
      value.arg,
      
    )
  }
}
struct TestInstanceReceiveReferenceArgs {
    pub arg: TestExternalClass,
     
}

impl TestInstanceReceiveReferenceArgs {
  pub fn new(
    arg: TestExternalClass,
     
  ) -> Self {
    TestInstanceReceiveReferenceArgs {
      arg: arg,
       
    }
  }
}

struct TestInstanceReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestInstanceReceiveReferenceArgsWrapped {
  pub fn new(
    arg: TestExternalClassWrapped,
  ) -> Self {
    TestInstanceReceiveReferenceArgsWrapped {
      arg: arg,
    }
  }

  pub fn serialize(value: TestInstanceReceiveReferenceArgs) -> Vec<u8> {
    json!(
        TestInstanceReceiveReferenceArgsWrapped.map_to_serializable(value)
    ).as_bytes()
  }

  pub fn map_to_serializable(value: TestInstanceReceiveReferenceArgs) -> TestInstanceReceiveReferenceArgsWrapped {
    TestInstanceReceiveReferenceArgsWrapped.new(
      
      TestExternalClassWrapped.map_to_serializable(value.arg),
            
    )
  }
}
struct TestStaticReceiveReferenceArgs {
    pub arg: TestExternalClass,
     
}

impl TestStaticReceiveReferenceArgs {
  pub fn new(
    arg: TestExternalClass,
     
  ) -> Self {
    TestStaticReceiveReferenceArgs {
      arg: arg,
       
    }
  }
}

struct TestStaticReceiveReferenceArgsWrapped {
    pub arg: TestExternalClassWrapped,
}

impl TestStaticReceiveReferenceArgsWrapped {
  pub fn new(
    arg: TestExternalClassWrapped,
  ) -> Self {
    TestStaticReceiveReferenceArgsWrapped {
      arg: arg,
    }
  }

  pub fn serialize(value: TestStaticReceiveReferenceArgs) -> Vec<u8> {
    json!(
        TestStaticReceiveReferenceArgsWrapped.map_to_serializable(value)
    ).as_bytes()
  }

  pub fn map_to_serializable(value: TestStaticReceiveReferenceArgs) -> TestStaticReceiveReferenceArgsWrapped {
    TestStaticReceiveReferenceArgsWrapped.new(
      
      TestExternalClassWrapped.map_to_serializable(value.arg),
            
    )
  }
}

use std::sync::Arc;

use reim_wrap::{ ExternalModule };
use serde::{Serialize, Deserialize};
use serde_json::json;
use crate::polywrap::wrap_manifest::{ WrapManifest };
use crate::polywrap::dt::{ ExternalResource };
use crate::polywrap::external::module::{ WrapModule };
use crate::polywrap::wrapped::{ TestExternalClassWrapped };

use crate::polywrap::external::module::external_wrap_module;

pub fn create(external_module: Arc<dyn ExternalModule>) -> TestExternalClassImport {
    TestExternalClassImport::new(external_module)
}

pub struct TestExternalClassImport {
    external_module: Arc<dyn ExternalModule>,
}

impl TestExternalClassImport {
    pub fn new(external_module: Arc<dyn ExternalModule>) -> TestExternalClassImport {
        TestExternalClassImport {
            external_module,
        }
    }

    
    pub async fn create(
        &self,
        arg: String,
    ) -> TestExternalClass {
        let args = CreateArgs::new( 
            arg,
             
        );

        let buffer = [
            &(WrapManifest::External::Class::TestExternalClass as u32).to_be_bytes()[..],
            &(WrapManifest::External::Classes::TestExternalClassMethod::Create as u32).to_be_bytes()[..],
            CreateArgsWrapped::serialize(&args),
        ].concat();

        let external_module = Arc::clone(&self.external_module);
        let result = external_module.invoke_resource(ExternalResource::InvokeClassMethod as u32, &buffer).await;

        let external_module = Arc::clone(&self.external_module);

        TestExternalClassWrapped::deserialize(&result, external_module)
    }
                
    pub async fn testStaticMethod(
        &self,
        arg: String,
    ) -> String {
        let args = TestStaticMethodArgs::new( 
            arg,
             
        );

        let buffer = [
            &(WrapManifest::External::Class::TestExternalClass as u32).to_be_bytes()[..],
            &(WrapManifest::External::Classes::TestExternalClassMethod::TestStaticMethod as u32).to_be_bytes()[..],
            TestStaticMethodArgsWrapped::serialize(&args),
        ].concat();

        let external_module = Arc::clone(&self.external_module);
        let result = self.external_module.invoke_resource(ExternalResource::InvokeClassMethod as u32, &buffer).await;

        let external_module = Arc::clone(&self.external_module);
        
        BaseTypeSerialization.deserialize<String>(result)
    }
    
}

pub struct TestExternalClass {
    __referencePtr: u32,
    __external_module: Arc<dyn ExternalModule>,
}

impl TestExternalClass {
    pub fn new(
        __referencePtr: u32,
        __external_module: Arc<dyn ExternalModule>,
    ) -> Self {
        Self {
            __referencePtr,
            __external_module,
        }
    }
    
    pub async fn create(
        arg: String,
    ) -> TestExternalClass {
        if external_wrap_module.is_none() {
            panic!("connect() or import() must be called before using this module");
        }

        let external_module = Arc::clone(external_wrap_module.as_ref().unwrap());

        TestExternalClassImport::new(external_module)
        .create(
            arg,
        ).await
    }
            
    pub async fn testInstanceMethod(
        &self,
        arg: String,
    ) -> String {
        let args = TestInstanceMethodArgs::new( 
        arg,
        
        );

        let buffer = [
        &(WrapManifest::External::Class::TestExternalClass as u32).to_be_bytes()[..],
        &(WrapManifest::External::Classes::TestExternalClassMethod::TestInstanceMethod as u32).to_be_bytes()[..],
        &self.__referencePtr.to_be_bytes()[..],
        TestInstanceMethodArgsWrapped::serialize(&args),
        ].concat();

        let external_module = Arc::clone(&self.__external_module);
        let result = external_module.invoke_resource(ExternalResource::InvokeClassMethod as u32, &buffer).await;
      
        let external_module = Arc::clone(&self.__external_module);
        
        // BaseTypeSerialization.deserialize<String>(result)
        "test".to_string()
    }
        
    pub async fn testStaticMethod(
        arg: String,
    ) -> String {
        if external_wrap_module.is_none() {
            panic!("connect() or import() must be called before using this module");
        }

        let external_module = Arc::clone(external_wrap_module.as_ref().unwrap());
        TestExternalClassImport::new(external_module)
        .testStaticMethod(
            arg,
        ).await
    }
    
}

struct CreateArgs {
    pub arg: String,
     
}

impl CreateArgs {
  pub fn new(
    arg: String,
     
  ) -> Self {
    CreateArgs {
      arg: arg,
       
    }
  }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateArgsWrapped {
    pub arg: String,
}

impl CreateArgsWrapped {
  pub fn new(
    arg: String,
  ) -> Self {
    CreateArgsWrapped {
      arg: arg,
    }
  }

  pub fn serialize(value: &CreateArgs) -> &[u8] {
    json!(
        CreateArgsWrapped::map_to_serializable(value)
    ).to_string()
    .as_bytes()
  }

  pub fn map_to_serializable(value: &CreateArgs) -> CreateArgsWrapped {
    CreateArgsWrapped::new(
            
      value.arg,
      
    )
  }
}

struct TestInstanceMethodArgs {
    pub arg: String,
     
}

impl TestInstanceMethodArgs {
  pub fn new(
    arg: String,
     
  ) -> Self {
    TestInstanceMethodArgs {
      arg: arg,
       
    }
  }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestInstanceMethodArgsWrapped {
    pub arg: String,
}

impl TestInstanceMethodArgsWrapped {
  pub fn new(
    arg: String,
  ) -> Self {
    TestInstanceMethodArgsWrapped {
      arg: arg,
    }
  }

  pub fn serialize(value: &TestInstanceMethodArgs) -> &[u8] {
    json!(
        TestInstanceMethodArgsWrapped::map_to_serializable(value)
    ).to_string()
    .as_bytes()
  }

  pub fn map_to_serializable(value: &TestInstanceMethodArgs) -> TestInstanceMethodArgsWrapped {
    TestInstanceMethodArgsWrapped::new(
            
      value.arg,
      
    )
  }
}
struct TestStaticMethodArgs {
    pub arg: String,
     
}

impl TestStaticMethodArgs {
  pub fn new(
    arg: String,
     
  ) -> Self {
    TestStaticMethodArgs {
      arg: arg,
       
    }
  }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestStaticMethodArgsWrapped {
    pub arg: String,
}

impl TestStaticMethodArgsWrapped {
  pub fn new(
    arg: String,
  ) -> Self {
    TestStaticMethodArgsWrapped {
      arg: arg,
    }
  }

  pub fn serialize(value: &TestStaticMethodArgs) -> &[u8] {
    json!(
        TestStaticMethodArgsWrapped::map_to_serializable(value)
    ).to_string()
    .as_bytes()
  }

  pub fn map_to_serializable(value: &TestStaticMethodArgs) -> TestStaticMethodArgsWrapped {
    TestStaticMethodArgsWrapped::new(
            
      value.arg,
      
    )
  }
}

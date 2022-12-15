use std::sync::Arc;

use reim_dt::ExternalModule;
use serde::{Serialize, Deserialize};
use serde_json::json;
use crate::polywrap::external::module::external_wrap_module::get_external_module_or_panic;
use crate::polywrap::wrap::{ExternalResource, wrap_manifest};
use crate::polywrap::external::wrapped::TestExternalClassWrapped;
use crate::polywrap::internal::wrapped::StringWrapped;

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
    ) -> Arc<TestExternalClass> {
        let args = CreateArgs::new( 
            arg,
             
        );

        let buffer = [
            &(ExternalResource::InvokeClassMethod as u32).to_be_bytes()[..],
            &(wrap_manifest::external::Class::TestExternalClass as u32).to_be_bytes()[..],
            &(wrap_manifest::external::classes::TestExternalClassMethod::Create as u32).to_be_bytes()[..],
            &CreateArgsWrapped::serialize(&args),
        ].concat();

        let external_module = Arc::clone(&self.external_module);
        let result = external_module.send(&buffer).await;

        TestExternalClassWrapped::deserialize(&result, Arc::clone(&self.external_module))
    }
                
    pub async fn testStaticMethod(
        &self,
        arg: String,
    ) -> String {
        let args = TestStaticMethodArgs::new( 
            arg,
             
        );

        let buffer = [
            &(ExternalResource::InvokeClassMethod as u32).to_be_bytes()[..],
            &(wrap_manifest::external::Class::TestExternalClass as u32).to_be_bytes()[..],
            &(wrap_manifest::external::classes::TestExternalClassMethod::TestStaticMethod as u32).to_be_bytes()[..],
            &TestStaticMethodArgsWrapped::serialize(&args),
        ].concat();

        let external_module = Arc::clone(&self.external_module);
        let result = external_module.send(&buffer).await;

        StringWrapped::deserialize(&result)
    }
    
}

pub struct TestExternalClass {
    pub __reference_ptr: u32,
    pub __external_module: Arc<dyn ExternalModule>,
}

impl TestExternalClass {
    pub fn new(
        __reference_ptr: u32,
        __external_module: Arc<dyn ExternalModule>,
    ) -> Self {
        Self {
            __reference_ptr,
            __external_module,
        }
    }
    
    pub async fn create(
        arg: String,
    ) -> Arc<TestExternalClass> {
        let external_module = get_external_module_or_panic().await;

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
            &(ExternalResource::InvokeClassMethod as u32).to_be_bytes()[..],
            &(wrap_manifest::external::Class::TestExternalClass as u32).to_be_bytes()[..],
            &(wrap_manifest::external::classes::TestExternalClassMethod::TestInstanceMethod as u32).to_be_bytes()[..],
            &self.__reference_ptr.to_be_bytes()[..],
            &TestInstanceMethodArgsWrapped::serialize(&args),
        ].concat();

        let external_module = Arc::clone(&self.__external_module);
        let result = external_module.send(&buffer).await;
      
        StringWrapped::deserialize(&result)
    }
        
    pub async fn testStaticMethod(
        arg: String,
    ) -> String {
        let external_module = get_external_module_or_panic().await;

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

  pub fn serialize(value: &CreateArgs) -> Vec<u8> {
    json!(
        CreateArgsWrapped::map_to_serializable(value)
    ).to_string()
    .as_bytes()
    .to_vec()
  }

  pub fn map_to_serializable(value: &CreateArgs) -> CreateArgsWrapped {
    CreateArgsWrapped::new(
            
      value.arg.clone(),
      
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

  pub fn serialize(value: &TestInstanceMethodArgs) -> Vec<u8> {
    json!(
        TestInstanceMethodArgsWrapped::map_to_serializable(value)
    ).to_string()
    .as_bytes()
    .to_vec()
  }

  pub fn map_to_serializable(value: &TestInstanceMethodArgs) -> TestInstanceMethodArgsWrapped {
    TestInstanceMethodArgsWrapped::new(
            
      value.arg.clone(),
      
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

  pub fn serialize(value: &TestStaticMethodArgs) -> Vec<u8> {
    json!(
        TestStaticMethodArgsWrapped::map_to_serializable(value)
    ).to_string()
    .as_bytes()
    .to_vec()
  }

  pub fn map_to_serializable(value: &TestStaticMethodArgs) -> TestStaticMethodArgsWrapped {
    TestStaticMethodArgsWrapped::new(
            
      value.arg.clone(),
      
    )
  }
}

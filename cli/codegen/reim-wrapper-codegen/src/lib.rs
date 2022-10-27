use std::fs::{read_to_string, write, self};
use inflector::Inflector;
use serde_derive::*;

extern crate mustache;

use reim_schema::*;

pub fn generate_bindings(input_path: String, output_path: String) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path.to_string() + "/schema.graphql")?;

    let abi = parse_schema(schema);

    println!("{:?}", abi);
    let module_type = abi.iter().find(|x| {
      if let SchemaType::Class(x) = x {
          if x.name == "Module" {
              return true;
          }
      }
      return false;
    });

    let empty: Vec<FunctionType> = vec![];
    let abi_functions = match module_type {
      Some(x) => if let SchemaType::Class(x) = x {
        &x.methods
      } else {
        &empty
      },
      None => panic!("Module type not found")
    };

    let abi_functions: Vec<SerializationFunction> = abi_functions.iter().enumerate().map(|(i, x)| {
      SerializationFunction {
        index: i,
        name: if let Some(name) = &x.name { name.to_string() } else { "".to_string() },
        name_pascal_case: if let Some(name) = &x.name { name.to_pascal_case() } else { "".to_string() },
        return_type: if let Some(return_type) = &x.return_type { return_type.to_string() } else { "".to_string() },
        as_return_type: if let Some(return_type) = &x.return_type { return_type.to_string() } else { "".to_string() },
        first: false,
        last: false,
        args: x.args.iter().enumerate().map(|(i, arg)| {
          SerializationArgInfo {
            first: if i == 0 { true } else { false },
            last: if i == x.args.len() - 1 { true } else { false },
            required: false,
            object: false,
            scalar: true,
            name: if let Some(name) = &arg.name { name.to_string() } else { "".to_string() },
            as_type_name: if let Some(name) = &arg.type_name { name.to_string() } else { "".to_string() },
            as_type_init: "\"\"".to_string(),
            msg_pack_type_name: "String".to_string(),
          }
        }).collect()
      }
    }).collect();
    for x in &abi_functions {
      render_function(x, output_path.clone())?;
    }

    let wrapp_info = SerializationWrapperInfo {
        wrapper_name: "MyWrapper".to_string(),
        global_functions: abi_functions.iter().enumerate().map(|(i, x)| {
          SerializationFunction {
            index: i,
            name: x.name.to_string(),
            name_pascal_case: x.name.to_pascal_case(),
            return_type: x.return_type.to_string(),
            as_return_type: x.as_return_type.to_string(),
            first: if i == 0 { true } else { false },
            last: if i == x.args.len() - 1 { true } else { false },
            args: x.args.iter().map(|arg| {
              SerializationArgInfo {
                first: arg.first,
                last: arg.last,
                required: arg.required,
                object: arg.object,
                scalar: arg.scalar,
                name: arg.name.to_string(),
                as_type_name: arg.as_type_name.to_string(),
                as_type_init: arg.as_type_init.to_string(),
                msg_pack_type_name: arg.msg_pack_type_name.to_string()
              }
            }).collect()
          }
        }).collect()
    };

    render_index(&wrapp_info, output_path.clone())?;
    render_global_functions_index(&wrapp_info, output_path.clone())?;
    render_invoke_global_function(&wrapp_info, output_path.clone())?;
    render_global_function(&wrapp_info, output_path.clone())?;
    render_functions_index(&wrapp_info, output_path.clone())?;
    
    Ok(())
}

pub fn generate_wrap_manifest(input_path: String, output_path: String) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path + "/schema.graphql")?;

    let abi = parse_schema(schema);

    let json_abi = serde_json::to_string_pretty(&WrapManifest {
      version: "0.1.0".to_string(),
      abi
    }).unwrap();
    write(output_path + "/wrap.info", &json_abi).unwrap();

    Ok(())
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WrapManifest {
  pub version: String,
  pub abi: WrapAbi
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationFunction {
  pub name: String,
  pub name_pascal_case: String,
  pub index: usize,
  pub args: Vec<SerializationArgInfo>,
  pub return_type: String,
  pub as_return_type: String,
  pub first: bool,
  pub last: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationArgInfo {
  pub name: String,
  pub as_type_name: String,
  pub as_type_init: String,
  pub msg_pack_type_name: String,
  pub object: bool,
  pub first: bool,
  pub last: bool,
  pub required: bool,
  pub scalar: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationWrapperInfo {
  pub wrapper_name: String,
  pub global_functions: Vec<SerializationFunction>,
}

pub fn render_class(class_type: &ClassType) {
    let template_str = read_to_string("test/templates/class-wrapped.mustache").unwrap();

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&class_type) {
        Ok(str) => {
            write(format!("test/out/types/{}.ts", class_type.name), str.as_bytes()).unwrap()
        },
        _ => {}
    }
}

pub fn render_function(function_type: &SerializationFunction, output_path: String) -> Result<(), std::io::Error> {
    let function_dir_path = output_path + "/polywrap/wrapped/global-functions/functions/" + &function_type.name;
    fs::create_dir_all(&function_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-function/args.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/args.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-function/args-serialization.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/args-serialization.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-function/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/index.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-function/serializeResult.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/serializeResult.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

pub fn render_index(_: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped";
    fs::create_dir_all(&base_dir_path)?;

    write(base_dir_path.clone() + "/index.ts", include_bytes!("templates/index.ts.mustache"))
}

pub fn render_global_functions_index(wrapper: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-functions/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(base_dir_path.clone() + "/index.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

pub fn render_invoke_global_function(wrapper: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-functions/invokeGlobalFunction.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(base_dir_path.clone() + "/invokeGlobalFunction.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

pub fn render_global_function(wrapper: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-functions/GlobalFunction.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(base_dir_path.clone() + "/GlobalFunction.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

pub fn render_functions_index(wrapper: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped/global-functions/functions";
    fs::create_dir_all(&base_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/global-functions/functions/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(base_dir_path.clone() + "/index.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::generate_bindings;

    #[test]
    fn internal_function() -> Result<(), std::io::Error> {
        generate_bindings("./test/in".to_string(), "./test/out".to_string())?;

        Ok(())
    }
}
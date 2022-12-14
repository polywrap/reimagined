use std::fs::{read_to_string, write, self};
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

    // for schema_type in &abi {
    //   match schema_type {
    //       SchemaType::Function(x) => render_function(x),
    //       SchemaType::Class(x) => render_class(x),
    //   };
    // }

    // let abi_functions = vec![
    //   SerializationFunction {
    //     name: "internalFunction".to_string(),
    //     args: vec![
    //       SerializationArgInfo {
    //         first: true,
    //         required: true,
    //         object: false,
    //         name: "arg1".to_string(),
    //         as_type_name: "String".to_string(),
    //         as_type_init: "\"\"".to_string()
    //       },
    //       SerializationArgInfo {
    //         first: false,
    //         required: false,
    //         object: false,
    //         name: "arg2".to_string(),
    //         as_type_name: "String".to_string(),
    //         as_type_init: "\"\"".to_string()
    //       },
    //     ],
    //     return_type: "String".to_string()
    //   }
    // ];

    let abi_functions: Vec<SerializationFunction> = abi_functions.iter().enumerate().map(|(i, x)| {
      SerializationFunction {
        index: i,
        name: if let Some(name) = &x.name { name.to_string() } else { "".to_string() },
        return_type: if let Some(return_type) = &x.return_type { return_type.to_string() } else { "".to_string() },
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
            return_type: x.return_type.to_string(),
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

    render_invoke_wasm_resource(&wrapp_info, output_path.clone())?;

    Ok(())
}

pub fn generate_wrap_manifest(input_path: String, output_path: String) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path + "/schema.graphql")?;

    let abi = parse_schema(schema);

    let json_abi = serde_json::to_string_pretty(&abi).unwrap();
    write(output_path + "/wrap.info", &json_abi).unwrap();

    Ok(())
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationFunction {
  pub name: String,
  pub index: usize,
  pub args: Vec<SerializationArgInfo>,
  pub return_type: String,
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
    let function_dir_path = output_path + "/wrap/wrapped/" + &function_type.name;
    fs::create_dir_all(&function_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/internal-function/args.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/args.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/internal-function/args-serialization.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/args-serialization.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/internal-function/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/index.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/internal-function/serializeResult.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(function_dir_path.clone() + "/serializeResult.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

pub fn render_invoke_wasm_resource(wrapper: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/wrap/wrapped";
    fs::create_dir_all(&base_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/invokeWasmResource.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(base_dir_path.clone() + "/invokeWasmResource.ts", str.as_bytes()).unwrap()
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
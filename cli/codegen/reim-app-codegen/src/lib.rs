use std::fs::{read_to_string, write, self};
use serde_derive::*;

extern crate mustache;

use reim_schema::*;

const SCALAR_TYPE_NAMES : [&str; 5] = ["String", "Uint32", "Int32", "Boolean", "Bytes"];

pub fn generate_app_codegen(input_path: String, output_path: String) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path + "/schema.graphql")?;

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

    let abi_functions = abi_functions.iter().enumerate().map(|(i, x)| {
      SerializationFunction {
        name: x.name.to_string(),
        return_type: x.return_type.to_string(),
        first: if i == 0 { true } else { false },
        last: if i == x.args.len() - 1 { true } else { false },
        args: x.args.iter().enumerate().map(|(i, arg)| {
          SerializationArgInfo {
            first: if i == 0 { true } else { false },
            last: if i == x.args.len() - 1 { true } else { false },
            required: false,
            object: false,
            scalar: SCALAR_TYPE_NAMES.contains(&arg.type_name.as_str()),
            name: arg.name.clone(),
            as_type_name: arg.type_name.clone(),
            ts_type_name: arg.type_name.clone(),
            as_type_init: "\"\"".to_string(),
            msg_pack_type_name: "String".to_string(),
          }
        }).collect()
      }
    });

    let func_len = abi_functions.len();
    let wrapp_info = SerializationWrapperInfo {
      wrapper_name: "MyWrapper".to_string(),
      global_functions: abi_functions.enumerate().map(|(i, x)| {
        SerializationFunction {
          name: x.name,
          return_type: x.return_type,
          first: if i == 0 { true } else { false },
          last: if i == func_len - 1 { true } else { false },
          args: x.args.iter().map(|arg| {
            SerializationArgInfo {
              first: arg.first,
              last: arg.last,
              required: arg.required,
              object: arg.object,
              scalar: arg.scalar,
              name: arg.name.to_string(),
              as_type_name: arg.as_type_name.to_string(),
              ts_type_name: arg.as_type_name.to_string(),
              as_type_init: arg.as_type_init.to_string(),
              msg_pack_type_name: arg.msg_pack_type_name.to_string()
            }
          }).collect()
        }
      }).collect()
    };

    render_wrapper(&wrapp_info, output_path)?;

    Ok(())
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationFunction {
  pub name: String,
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
  pub ts_type_name: String,
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

pub fn render_wrapper(wrapper: &SerializationWrapperInfo, output_path: String) -> Result<(), std::io::Error> {
    let function_dir_path = output_path + "/wrap/" + &wrapper.wrapper_name;
    fs::create_dir_all(&function_dir_path)?;

    let template_str =  String::from_utf8_lossy(include_bytes!("templates/wrapper.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(function_dir_path.clone() + "/wrapper.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}


#[cfg(test)]
mod tests {
    use crate::generate_app_codegen;

    #[test]
    fn internal_function() -> Result<(), std::io::Error> {
      generate_app_codegen("./test/in".to_string(), "./test/out".to_string())?;

        Ok(())
    }
}
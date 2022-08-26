use std::fs::{read_to_string, write};
use serde_derive::*;

extern crate mustache;

pub mod abi;
mod parse_schema;

use abi::*;
use parse_schema::*;

const INPUT_PATH: &'static str = "./";
const OUTPUT_PATH: &'static str = "./src/wrap/wrapped";

fn main() -> Result<(), std::io::Error> {
    let schema = read_to_string(INPUT_PATH.to_string() + "schema.graphql")?;

    let mut parser = tree_sitter::Parser::new();
    parser.set_language(tree_sitter_wrap::language()).unwrap();
   
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

    let abi_functions = abi_functions.iter().map(|x| {
      SerializationFunction {
        name: if let Some(name) = &x.name { name.to_string() } else { "".to_string() },
        return_type: if let Some(return_type) = &x.return_type { return_type.to_string() } else { "".to_string() },
        args: x.args.iter().enumerate().map(|(i, arg)| {
          SerializationArgInfo {
            first: if i == 0 { true } else { false },
            last: if i == x.args.len() - 1 { true } else { false },
            required: false,
            object: false,
            name: if let Some(name) = &arg.name { name.to_string() } else { "".to_string() },
            as_type_name: if let Some(name) = &arg.type_name { name.to_string() } else { "".to_string() },
            as_type_init: "\"\"".to_string()
          }
        }).collect()
      }
    });
    for x in abi_functions {
      render_function(&x);
    }

    // let jsonAbi = serde_json::to_string_pretty(&abi).unwrap();
    // write("test/out/abi.json", &jsonAbi).unwrap();

    Ok(())
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationFunction {
  pub name: String,
  pub args: Vec<SerializationArgInfo>,
  pub return_type: String
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SerializationArgInfo {
  pub name: String,
  pub as_type_name: String,
  pub as_type_init: String,
  pub object: bool,
  pub first: bool,
  pub last: bool,
  pub required: bool,
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

pub fn render_function(function_type: &SerializationFunction) {
    let template_str = read_to_string("test/templates/internal-function/args.ts.mustache").unwrap();

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(OUTPUT_PATH.to_string() + "/" + &function_type.name + "/args.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str = read_to_string("test/templates/internal-function/args-serialization.ts.mustache").unwrap();

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(OUTPUT_PATH.to_string() + "/" + &function_type.name + "/args-serialization.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str = read_to_string("test/templates/internal-function/index.ts.mustache").unwrap();

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(OUTPUT_PATH.to_string() + "/" + &function_type.name + "/index.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str = read_to_string("test/templates/internal-function/serializeResult.ts.mustache").unwrap();

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&function_type) {
        Ok(str) => {
            write(OUTPUT_PATH.to_string() + "/" + &function_type.name + "/serializeResult.ts", str.as_bytes()).unwrap()
        },
        _ => {}
    };
}

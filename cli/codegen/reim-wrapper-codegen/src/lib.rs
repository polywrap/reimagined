use std::{fs::{read_to_string, write, self}, collections::HashSet};
use inflector::Inflector;

extern crate mustache;
mod models;

use reim_schema::*;
use models::*;
use serde_derive::{Serialize, Deserialize};
use serde_json::{ to_string_pretty};


pub fn generate_bindings(input_path: String, output_path: String) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path.to_string() + "/schema.graphql")?;

    let abi = parse_schema(schema);
    println!("xxxxxxxxxxxx {:?}", abi);

    println!("{}", to_string_pretty(&abi).unwrap());
    let wrapper = WrapperModel {
        wrapper_name: "MyWrapper".to_string(),
        global_functions: GlobalFunctionsModel::build(
          listify(abi
            .iter()
            .filter_map(|x| {
                match x {
                    SchemaType::Function(func) => Some(func.clone()),
                    _ => None
                }
            })
            .map(|x| {
                FunctionModel::build(
                    FunctionModel {
                        name: x.name.clone(),
                        name_pascal_case: x.name.to_pascal_case(),
                        class_name: None,
                        is_static: x.is_static,
                        is_external: x.is_external,
                        result: TypeInfo::new(&x.result, &abi),
                        related_types: vec![],
                        args: listify(x.args.iter().map(|arg| {
                            NamedTypeInfo {
                                name: arg.name.clone(),
                                type_info: TypeInfo::new(&arg.type_info, &abi)
                            }
                        }).collect()),
                    },
                    None
                )
            }).collect()),
        ),
        types: listify(abi
          .iter()
          .filter_map(|x| {
              match x { 
                  SchemaType::Type(type_info) => Some(type_info.clone()),
              _    => None
              }
          })
          .map(|x| {
              TypeModel::build(
                  TypeModel {
                      name: x.name.clone(),
                      is_class: x.is_class,
                      is_external: x.is_external,
                      is_struct: x.is_struct,
                      related_types: vec![],
                      fields: listify(x.fields
                          .iter()
                          .map(|arg| {
                              NamedTypeInfo {
                                  name: arg.name.clone(),
                                  type_info: TypeInfo::new(&arg.type_info, &abi)
                              }
                              
                          })
                          .collect()),
                      methods: listify(x.methods
                          .iter()
                          .map(|method| {
                              FunctionModel::build(
                                  FunctionModel {
                                      name: method.name.clone(),
                                      name_pascal_case: method.name.to_pascal_case(),
                                      class_name: Some(x.name.clone()),
                                      is_static: method.is_static,
                                      is_external: method.is_external,
                                      result: TypeInfo::new(&method.result, &abi),
                                      related_types: vec![],
                                      args: listify(method.args
                                          .iter()
                                          .map(|arg| {
                                              NamedTypeInfo {
                                                  name: arg.name.clone(),
                                                  type_info: TypeInfo::new(&arg.type_info, &abi),
                                              }
                                          }).collect()),
                                  },
                                  Some(&x)
                              )
                          })
                          .collect())
                  }
              )
          })
          .collect())
    };

    render_wrapped(&wrapper, output_path.clone())?;
    render_wrapper(&wrapper, output_path.clone())?;
    render_host(&wrapper, output_path.clone())?;
    
    Ok(())
}

pub fn listify<T>(list: Vec<T>) -> Vec<ListModel<T>> {
    let length = list.len();

    list
        .into_iter()
        .enumerate()
        .map(|(i, x)| {
            ListModel {
                index: i,
                first: if i == 0 { true } else { false },
                last: if i == length - 1 { true } else { false },
                model: x
            }
        })
        .collect()
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

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct MethodsModel {
    pub list: Vec<ListModel<FunctionModel>>,
    pub related_types: Vec<TypeInfo>,
}

fn render_wrapped(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped";
    fs::create_dir_all(&base_dir_path)?;

    for class_type in wrapper.types.iter().filter(|x| x.model.is_class) {
        fs::create_dir_all(format!("{}/{}", base_dir_path, class_type.model.name))?;

        let template_str = if class_type.model.is_external {
            String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapped/ExternalClassWrapped.ts.mustache"))
        } else {
            String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapped/InternalClassWrapped.ts.mustache"))
        };

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}/{}Wrapped.ts", base_dir_path.clone(), class_type.model.name, class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };


        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/method-invoke.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        println!("xxxxxxxaaaaaaaaaaxxxxxaaaa {:?}", class_type.model.related_types.clone());

        match template.render_to_string(& MethodsModel {
            list: class_type.model.methods.clone(),
            related_types: class_type.model.methods
            .iter()
            .flat_map(|func| func.model.related_types.clone())
            .collect::<HashSet<TypeInfo>>()
            .into_iter()
            .collect()
        }) {
            Ok(str) => {
                write(format!("{}/{}/invoke.ts", base_dir_path.clone(), class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };
    }

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapped/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/index.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

fn render_wrapper(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
    render_wrapper_global_functions(wrapper, &output_path)?;
    render_wrapper_classes(wrapper, &output_path)?;
    Ok(())
}

fn render_wrapper_global_functions(wrapper: &WrapperModel, output_path: &str) -> Result<(), std::io::Error> {
    let base_dir_path = output_path.to_string() + "/polywrap/wrapper/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/global-function-invoke.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper.global_functions) {
        Ok(str) => {
            write(format!("{}/invokeGlobalFunction.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };
    
    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/global-functions/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/index.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

fn render_wrapper_classes(wrapper: &WrapperModel, output_path: &str) -> Result<(), std::io::Error> {
    let base_dir_path = output_path.to_string() + "/polywrap/wrapper/classes";
    fs::create_dir_all(&base_dir_path)?;
    
    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/invokeClassMethod.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/invokeClassMethod.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

fn render_host(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
    render_host_global_functions(wrapper, &output_path)?;
    render_host_classes(wrapper, &output_path)?;
    Ok(())
}

fn render_host_global_functions(wrapper: &WrapperModel, output_path: &str) -> Result<(), std::io::Error> {
    let base_dir_path = output_path.to_string() + "/polywrap/host/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    for func in wrapper.global_functions.list.iter().filter(|x| x.model.is_external) {
        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/global-functions/functionName.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&func.model) {
            Ok(str) => {
                write(format!("{}/{}.ts", base_dir_path.clone(), func.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };
    }

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/global-functions/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/index.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

fn render_host_classes(wrapper: &WrapperModel, output_path: &str) -> Result<(), std::io::Error> {
    let base_dir_path = output_path.to_string() + "/polywrap/host/classes";
    fs::create_dir_all(&base_dir_path)?;
    
    for class_type in wrapper.types.iter().filter(|x| x.model.is_class && x.model.is_external) {
        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/classes/ClassName.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}.ts", base_dir_path.clone(), class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };
    }

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/classes/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/index.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::{generate_bindings, generate_wrap_manifest};

    #[test]
    fn internal_function() -> Result<(), std::io::Error> {
        generate_wrap_manifest("./test/in".to_string(), "./test/out".to_string())?;
        generate_bindings("./test/in".to_string(), "./test/out".to_string())?;
        panic!("TODO");
        Ok(())
    }
}
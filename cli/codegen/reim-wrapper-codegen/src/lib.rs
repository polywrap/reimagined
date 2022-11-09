use std::fs::{read_to_string, write, self};
use inflector::Inflector;

extern crate mustache;
mod models;

use reim_schema::*;
use models::*;
use serde_json::{ to_string_pretty};


pub fn generate_bindings(input_path: String, output_path: String) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path.to_string() + "/schema.graphql")?;

    let abi = parse_schema(schema);
    println!("xxxxxxxxxxxx {:?}", abi);

    println!("{}", to_string_pretty(&abi).unwrap());
    let wrapper = WrapperModel {
        wrapper_name: "MyWrapper".to_string(),
        global_functions: listify(abi
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
                                            }).collect())
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

    // for x in &wrapper.global_functions {
    //     render_function(&x.model, output_path.clone())?;
    // }

    // render_index(&wrapper, output_path.clone())?;
    // render_global_functions_index(&wrapper, output_path.clone())?;
    // render_invoke_global_function(&wrapper, output_path.clone())?;
    // render_global_function(&wrapper, output_path.clone())?;
    // render_functions_index(&wrapper, output_path.clone())?;
    // render_types(&wrapper, output_path.clone())?;

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

pub fn render_class(class_type: &TypeInfo) {
    let template_str = read_to_string("test/templates/class-wrapped.mustache").unwrap();

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&class_type) {
        Ok(str) => {
            write(format!("test/out/types/{}.ts", class_type.type_name), str.as_bytes()).unwrap()
        },
        _ => {}
    }
}

pub fn render_function(function_type: &FunctionModel, output_path: String) -> Result<(), std::io::Error> {
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

pub fn render_index(_: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped";
    fs::create_dir_all(&base_dir_path)?;

    write(base_dir_path.clone() + "/index.ts", include_bytes!("templates/index.ts.mustache"))
}

pub fn render_global_functions_index(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
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

pub fn render_invoke_global_function(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
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

pub fn render_global_function(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
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

pub fn render_functions_index(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
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

pub fn render_types(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
  let base_dir_path = output_path + "/polywrap/wrapped/types";
  fs::create_dir_all(&base_dir_path)?;

  let template_str =  String::from_utf8_lossy(include_bytes!("templates/type.ts.mustache"));

  let template = mustache::compile_str(&template_str).unwrap();

  for type_info in wrapper.types.iter() {
    match template.render_to_string(type_info) {
        Ok(str) => {
            write(base_dir_path.clone() + "/" + &type_info.model.name + ".ts", str.as_bytes()).unwrap();
        },
        _ => {}
    };
  }

  Ok(())
}

fn render_wrapped(wrapper: &WrapperModel, output_path: String) -> Result<(), std::io::Error> {
    let base_dir_path = output_path + "/polywrap/wrapped";
    fs::create_dir_all(&base_dir_path)?;

    for class_type in wrapper.types.iter().filter(|x| x.model.is_class) {
        let template_str = if class_type.model.is_external {
            String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapped/ExternalClassWrapped.ts.mustache"))
        } else {
            String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapped/InternalClassWrapped.ts.mustache"))
        };

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}Wrapped.ts", base_dir_path.clone(), class_type.model.name), str.as_bytes()).unwrap()
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

    let path_to_create = output_path.to_string() + "/polywrap/wrapper/global-functions/list";
    fs::create_dir_all(&path_to_create)?;
    let base_dir_path = output_path.to_string() + "/polywrap/wrapper/global-functions";

    for func in wrapper.global_functions.iter().filter(|x| !x.model.is_external) {
        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/global-functions/list/functionWrapped.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&func.model) {
            Ok(str) => {
                write(format!("{}/list/{}Wrapped.ts", base_dir_path.clone(), func.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };
    }

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/global-functions/list/index.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/list/index.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/global-functions/GlobalFunction.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/GlobalFunction.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/global-functions/invokeGlobalFunction.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
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
    
    for class_type in wrapper.types.iter().filter(|x| x.model.is_class && !x.model.is_external) {
        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/ClassName/ClassNameMethod.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        fs::create_dir_all(format!("{}/{}", base_dir_path.clone(), class_type.model.name))?;

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}/{}Method.ts", base_dir_path.clone(), class_type.model.name, class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };

        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/ClassName/invokeClassNameMethod.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}/invoke{}Method.ts", base_dir_path.clone(), class_type.model.name, class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };

        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/ClassName/methods/index.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();
      
        fs::create_dir_all(format!("{}/{}/methods", base_dir_path.clone(), class_type.model.name))?;

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}/methods/index.ts", base_dir_path.clone(), class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };

        for method in class_type.model.methods.iter() {
            let template_str = if method.model.is_static {
                String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/ClassName/methods/staticMethodNameWrapped.ts.mustache"))
            } else {
                String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/ClassName/methods/instanceMethodNameWrapped.ts.mustache"))
            };
    
            let template = mustache::compile_str(&template_str).unwrap();

            match template.render_to_string(&method.model) {
                Ok(str) => {
                    write(format!("{}/{}/methods/{}Wrapped.ts", base_dir_path.clone(), class_type.model.name, method.model.name), str.as_bytes()).unwrap()
                },
                _ => {}
            };
        }
    }

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/wrapper/classes/ClassList.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/ClassList.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

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

    for func in wrapper.global_functions.iter().filter(|x| x.model.is_external) {
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

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/global-functions/GlobalFunctionList.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/GlobalFunctionList.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

fn render_host_classes(wrapper: &WrapperModel, output_path: &str) -> Result<(), std::io::Error> {
    let base_dir_path = output_path.to_string() + "/polywrap/host/classes";
    fs::create_dir_all(&base_dir_path)?;
    
    for class_type in wrapper.types.iter().filter(|x| x.model.is_class && x.model.is_external) {
        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/classes/ClassName/ClassNameMethod.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        fs::create_dir_all(format!("{}/{}", base_dir_path.clone(), class_type.model.name))?;

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}/{}Method.ts", base_dir_path.clone(), class_type.model.name, class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };

        let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/classes/ClassName/ClassName.ts.mustache"));

        let template = mustache::compile_str(&template_str).unwrap();

        match template.render_to_string(&class_type.model) {
            Ok(str) => {
                write(format!("{}/{}/{}.ts", base_dir_path.clone(), class_type.model.name, class_type.model.name), str.as_bytes()).unwrap()
            },
            _ => {}
        };
    }

    let template_str = String::from_utf8_lossy(include_bytes!("templates/polywrap/host/classes/ClassList.ts.mustache"));

    let template = mustache::compile_str(&template_str).unwrap();

    match template.render_to_string(&wrapper) {
        Ok(str) => {
            write(format!("{}/ClassList.ts", base_dir_path.clone()), str.as_bytes()).unwrap()
        },
        _ => {}
    };

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
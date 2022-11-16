use std::{fs::{read_to_string, write, self}, collections::HashSet};
use inflector::Inflector;

extern crate mustache;
mod models;

use reim_schema::*;
use models::*;
use serde_derive::{Serialize, Deserialize};
use serde_json::{ to_string_pretty};

pub enum Language {
    AssemblyScript,
    TypeScript,
    Rust,
}

pub enum ModuleType {
  Host,
  Wrapper
}

pub fn generate_bindings(input_path: String, output_path: String, language: &Language, module_type: &ModuleType) -> Result<(), std::io::Error> { 
    let schema = read_to_string(input_path.to_string() + "/schema.graphql")?;

    let abi = parse_schema(schema);

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

    let templates = match language {
        Language::AssemblyScript => {
            Templates {
                wrapped: WrappedTemplates {
                    internal_class: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/wrapped/InternalClassWrapped.ts.mustache")).to_string(),
                    external_class: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/wrapped/ExternalClassWrapped.ts.mustache")).to_string(),
                    index: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/wrapped/index.ts.mustache")).to_string(),
                },
                internal: InternalTemplates {
                    global_functions: InternalGlobalFunctionsTemplates {
                        index: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/internal/global-functions/index.ts.mustache")).to_string(),
                    },
                    classes: InternalClassesTemplates {
                        invoke_class_method: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/internal/classes/invokeClassMethod.ts.mustache")).to_string(),
                    },
                },
                external: ExternalTemplates {
                    global_functions: ExternalGlobalFunctionsTemplates { 
                        function_name: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/global-functions/functionName.ts.mustache")).to_string(),
                        index: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/global-functions/index.ts.mustache")).to_string(),
                    },
                    classes: ExternalClassesTemplates {
                        class_name: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/classes/ClassName.ts.mustache")).to_string(),
                        index: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/classes/index.ts.mustache")).to_string(),
                    },
                    module: ExternalModuleTemplates {
                        wrap_module: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/module/WrapModule.ts.mustache")).to_string(),
                        import_bindings: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/module/ImportBindings.ts.mustache")).to_string(),
                        internal_wrap_instance: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/module/InternalWrapInstance.ts.mustache")).to_string(),
                        host_wrap_instance: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/module/HostWrapInstance.ts.wrapper.mustache")).to_string(),
                    },
                    index: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/external/index.ts.mustache")).to_string(),
                },
                method_invoke: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/method-invoke.ts.mustache")).to_string(),
                global_function_invoke: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/global-function-invoke.ts.mustache")).to_string(),
                wrap_manifest: String::from_utf8_lossy(include_bytes!("templates/assemblyscript/WrapManifest.ts.mustache")).to_string(),
            }
        },
        Language::TypeScript => {
            Templates {
                wrapped: WrappedTemplates {
                    internal_class: String::from_utf8_lossy(include_bytes!("templates/typescript/wrapped/InternalClassWrapped.ts.mustache")).to_string(),
                    external_class: String::from_utf8_lossy(include_bytes!("templates/typescript/wrapped/ExternalClassWrapped.ts.mustache")).to_string(),
                    index: String::from_utf8_lossy(include_bytes!("templates/typescript/wrapped/index.ts.mustache")).to_string(),
                },
                internal: InternalTemplates {
                    global_functions: InternalGlobalFunctionsTemplates {
                        index: String::from_utf8_lossy(include_bytes!("templates/typescript/internal/global-functions/index.ts.mustache")).to_string(),
                    },
                    classes: InternalClassesTemplates {
                        invoke_class_method: String::from_utf8_lossy(include_bytes!("templates/typescript/internal/classes/invokeClassMethod.ts.mustache")).to_string(),
                    },
                },
                external: ExternalTemplates {
                    global_functions: ExternalGlobalFunctionsTemplates { 
                        function_name: String::from_utf8_lossy(include_bytes!("templates/typescript/external/global-functions/functionName.ts.mustache")).to_string(),
                        index: String::from_utf8_lossy(include_bytes!("templates/typescript/external/global-functions/index.ts.mustache")).to_string(),
                    },
                    classes: ExternalClassesTemplates {
                        class_name: String::from_utf8_lossy(include_bytes!("templates/typescript/external/classes/ClassName.ts.mustache")).to_string(),
                        index: String::from_utf8_lossy(include_bytes!("templates/typescript/external/classes/index.ts.mustache")).to_string(),
                    },
                    module: ExternalModuleTemplates {
                        wrap_module: String::from_utf8_lossy(include_bytes!("templates/typescript/external/module/WrapModule.ts.mustache")).to_string(),
                        import_bindings: String::from_utf8_lossy(include_bytes!("templates/typescript/external/module/ImportBindings.ts.mustache")).to_string(),
                        internal_wrap_instance: String::from_utf8_lossy(include_bytes!("templates/typescript/external/module/InternalWrapInstance.ts.mustache")).to_string(),
                        host_wrap_instance: String::from_utf8_lossy(include_bytes!("templates/typescript/external/module/HostWrapInstance.ts.wrapper.mustache")).to_string(),
                    },
                    index: String::from_utf8_lossy(include_bytes!("templates/typescript/external/index.ts.mustache")).to_string(),
                },
                method_invoke: String::from_utf8_lossy(include_bytes!("templates/typescript/method-invoke.ts.mustache")).to_string(),
                global_function_invoke: String::from_utf8_lossy(include_bytes!("templates/typescript/global-function-invoke.ts.mustache")).to_string(),
                wrap_manifest: String::from_utf8_lossy(include_bytes!("templates/typescript/WrapManifest.ts.mustache")).to_string(),
            }
        },
        Language::Rust => {
            Templates {
                wrapped: WrappedTemplates {
                    internal_class: String::from_utf8_lossy(include_bytes!("templates/rust/wrapped/InternalClassWrapped.rs.mustache")).to_string(),
                    external_class: String::from_utf8_lossy(include_bytes!("templates/rust/wrapped/ExternalClassWrapped.rs.mustache")).to_string(),
                    index: String::from_utf8_lossy(include_bytes!("templates/rust/wrapped/index.rs.mustache")).to_string(),
                },
                internal: InternalTemplates {
                    global_functions: InternalGlobalFunctionsTemplates {
                        index: String::from_utf8_lossy(include_bytes!("templates/rust/internal/global-functions/index.rs.mustache")).to_string(),
                    },
                    classes: InternalClassesTemplates {
                        invoke_class_method: String::from_utf8_lossy(include_bytes!("templates/rust/internal/classes/invoke_class_method.rs.mustache")).to_string(),
                    },
                },
                external: ExternalTemplates {
                    global_functions: ExternalGlobalFunctionsTemplates { 
                        function_name: String::from_utf8_lossy(include_bytes!("templates/rust/external/global_functions/functionName.rs.mustache")).to_string(),
                        index: String::from_utf8_lossy(include_bytes!("templates/rust/external/global_functions/index.rs.mustache")).to_string(),
                    },
                    classes: ExternalClassesTemplates {
                        class_name: String::from_utf8_lossy(include_bytes!("templates/rust/external/classes/ClassName.rs.mustache")).to_string(),
                        index: String::from_utf8_lossy(include_bytes!("templates/rust/external/classes/index.rs.mustache")).to_string(),
                    },
                    module: ExternalModuleTemplates {
                        wrap_module: String::from_utf8_lossy(include_bytes!("templates/rust/external/module/WrapModule.rs.mustache")).to_string(),
                        import_bindings: String::from_utf8_lossy(include_bytes!("templates/rust/external/module/ImportBindings.rs.mustache")).to_string(),
                        internal_wrap_instance: String::from_utf8_lossy(include_bytes!("templates/rust/external/module/InternalWrapInstance.rs.mustache")).to_string(),
                        host_wrap_instance: String::from_utf8_lossy(include_bytes!("templates/rust/external/module/HostWrapInstance.rs.wrapper.mustache")).to_string(),
                    },
                    index: String::from_utf8_lossy(include_bytes!("templates/rust/external/index.rs.mustache")).to_string(),
                },
                method_invoke: String::from_utf8_lossy(include_bytes!("templates/rust/method_invoke.rs.mustache")).to_string(),
                global_function_invoke: String::from_utf8_lossy(include_bytes!("templates/rust/global_function_invoke.rs.mustache")).to_string(),
                wrap_manifest: String::from_utf8_lossy(include_bytes!("templates/rust/WrapManifest.rs.mustache")).to_string(),
            }
        }
    };

    render_wrapped(&wrapper, output_path.clone(), &language, &templates, &module_type)?;
    render_internal(&wrapper, output_path.clone(), &language, &templates, &module_type)?;
    render_external(&wrapper, output_path.clone(), &language, &templates, &module_type)?;
    render_wrap_manifest(&wrapper, &output_path.clone(), &language, &templates, &module_type)?;
    
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

struct Templates {
    wrapped: WrappedTemplates,
    external: ExternalTemplates,
    internal: InternalTemplates,
    wrap_manifest: String,
    global_function_invoke: String,
    method_invoke: String,
}

struct WrappedTemplates {
    external_class: String,
    internal_class: String,
    index: String,
}

struct InternalTemplates {
    global_functions: InternalGlobalFunctionsTemplates,
    classes: InternalClassesTemplates,
}

struct InternalGlobalFunctionsTemplates {
    index: String,
}

struct InternalClassesTemplates {
    invoke_class_method: String,
}

struct ExternalTemplates {
    module: ExternalModuleTemplates,
    global_functions: ExternalGlobalFunctionsTemplates,
    classes: ExternalClassesTemplates,
    index: String,
}

struct ExternalModuleTemplates {
    wrap_module: String,
    import_bindings: String,
    internal_wrap_instance: String,
    host_wrap_instance: String,
}

struct ExternalGlobalFunctionsTemplates {
    function_name: String,
    index: String,
}

struct ExternalClassesTemplates {
    class_name: String,
    index: String,
}

fn render_wrapped(wrapper: &WrapperModel, output_path: String, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
   
    let base_dir_path = output_path + "/polywrap/wrapped";
    fs::create_dir_all(&base_dir_path)?;

    for class_type in wrapper.types.iter().filter(|x| x.model.is_class) {
        fs::create_dir_all(format!("{}/{}", base_dir_path, class_type.model.name))?;

        let template_str = if class_type.model.is_external {
            &templates.wrapped.external_class
        } else {
            &templates.wrapped.internal_class
        };

        render_template(
            &template_str, 
            &class_type.model, 
            &format!("{}/{}/{}Wrapped.{}", base_dir_path.clone(), class_type.model.name, class_type.model.name, lang_extension)
        )?;

        let methods_model = MethodsModel {
            list: class_type.model.methods.clone(),
            related_types: class_type.model.methods
            .iter()
            .flat_map(|func| func.model.related_types.clone())
            .collect::<HashSet<TypeInfo>>()
            .into_iter()
            .collect()
        };

        render_template(
            &templates.method_invoke, 
            &methods_model, 
            &format!("{}/{}/invoke.{}", base_dir_path.clone(), class_type.model.name, lang_extension)
        )?;
    }

    render_template(
        &templates.wrapped.index, 
        &wrapper, 
        &format!("{}/index.{}", base_dir_path.clone(), lang_extension)
    )?;

    Ok(())
}

fn render_internal(wrapper: &WrapperModel, output_path: String, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    render_internal_global_functions(wrapper, &output_path, language, templates, module_type)?;
    render_internal_classes(wrapper, &output_path, language, templates, module_type)?;
    Ok(())
}

fn render_internal_global_functions(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
   
    let base_dir_path = output_path.to_string() + "/polywrap/internal/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    render_template(
        &templates.global_function_invoke, 
        &wrapper.global_functions, 
        &format!("{}/invokeGlobalFunction.{}", base_dir_path.clone(), lang_extension)
    )?;
    
    render_template(
        &templates.internal.global_functions.index, 
        &wrapper, 
        &format!("{}/index.{}", base_dir_path.clone(), lang_extension)
    )?;
    
    Ok(())
}

fn render_internal_classes(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
    
    let base_dir_path = output_path.to_string() + "/polywrap/internal/classes";
    fs::create_dir_all(&base_dir_path)?;

    render_template(
        &templates.internal.classes.invoke_class_method, 
        &wrapper, 
        &format!("{}/invokeClassMethod.{}", base_dir_path.clone(), lang_extension)
    )?;

    Ok(())
}

fn render_external(wrapper: &WrapperModel, output_path: String, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    render_module(wrapper, &output_path, language, templates, module_type)?;
    render_external_global_functions(wrapper, &output_path, language, templates, module_type)?;
    render_external_classes(wrapper, &output_path, language, templates, module_type)?;
    render_external_index(wrapper, &output_path, language, templates, module_type)?;
    Ok(())
}

fn render_module(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
    
    let base_dir_path = output_path.to_string() + "/polywrap/external/module";
    fs::create_dir_all(&base_dir_path)?;

    render_template(
        &templates.external.module.wrap_module, 
        &wrapper, 
        &format!("{}/WrapModule.{}", base_dir_path.clone(), lang_extension)
    )?;

    render_template(
        &templates.external.module.import_bindings, 
        &wrapper, 
        &format!("{}/ImportBindings.{}", base_dir_path.clone(), lang_extension)
    )?;

    render_template(
        &templates.external.module.internal_wrap_instance, 
        &wrapper, 
        &format!("{}/InternalWrapInstance.{}", base_dir_path.clone(), lang_extension)
    )?;

    match module_type {
        ModuleType::Wrapper => {
            render_template(
                &templates.external.module.host_wrap_instance, 
                &wrapper, 
                &format!("{}/HostWrapInstance.{}", base_dir_path.clone(), lang_extension)
            )?;
        },
        ModuleType::Host => {}
    }

    Ok(())
}

fn render_external_global_functions(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
    
    let base_dir_path = output_path.to_string() + "/polywrap/external/global-functions";
    fs::create_dir_all(&base_dir_path)?;

    for func in wrapper.global_functions.list.iter().filter(|x| x.model.is_external) {
        println!("Rendering global function: {}", func.model.name);
        println!("{:?}", func.model);
        render_template(
            &templates.external.global_functions.function_name, 
            &func.model, 
            &format!("{}/{}.{}", base_dir_path.clone(), func.model.name, lang_extension)
        )?;
    }

    render_template(
        &templates.external.global_functions.index, 
        &wrapper, 
        &format!("{}/index.{}", base_dir_path.clone(), lang_extension)
    )?;

    Ok(())
}

fn render_external_classes(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
    
    let base_dir_path = output_path.to_string() + "/polywrap/external/classes";
    fs::create_dir_all(&base_dir_path)?;
    
    for class_type in wrapper.types.iter().filter(|x| x.model.is_class && x.model.is_external) {
        render_template(
            &templates.external.classes.class_name, 
            &class_type.model, 
            &format!("{}/{}.{}", base_dir_path.clone(), class_type.model.name, lang_extension)
        )?;
    }

    render_template(
        &templates.external.classes.index, 
        &wrapper, 
        &format!("{}/index.{}", base_dir_path.clone(), lang_extension)
    )?;

    Ok(())
}

fn render_external_index(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };
    
    let base_dir_path = output_path.to_string() + "/polywrap/external";
    fs::create_dir_all(&base_dir_path)?;

    render_template(
        &templates.external.index, 
        &wrapper, 
        &format!("{}/index.{}", base_dir_path.clone(), lang_extension)
    )?;

    Ok(())
}

fn render_wrap_manifest(wrapper: &WrapperModel, output_path: &str, language: &Language, templates: &Templates, module_type: &ModuleType) -> Result<(), std::io::Error> {
    let lang_extension = match language {
        Language::AssemblyScript => "ts",
        Language::TypeScript => "ts",
        Language::Rust => "rs",
    };

    let base_dir_path = output_path.to_string() + "/polywrap";
    fs::create_dir_all(&base_dir_path)?;

    render_template(
        &templates.wrap_manifest, 
        &wrapper, 
        &format!("{}/WrapManifest.{}", base_dir_path.clone(), lang_extension)
    )?;

    Ok(())
}

fn render_template<T: serde::Serialize>(template: &str, model: &T, output_path: &str) -> Result<(), std::io::Error> {
    let template = mustache::compile_str(
        &template
    ).unwrap();

    match template.render_to_string(&model) {
        Ok(str) => {
            write(output_path, str.as_bytes()).unwrap()
        },
        _ => {}
    };

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::{generate_bindings, generate_wrap_manifest, Language, ModuleType};

    #[test]
    fn internal_function() -> Result<(), std::io::Error> {
        generate_wrap_manifest("./test/in".to_string(), "./test/out".to_string())?;
        generate_bindings("./test/in".to_string(), "./test/out".to_string(), &Language::Rust, &ModuleType::Host)?;
        panic!("TODO");
        Ok(())
    }
}
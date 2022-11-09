use std::collections::HashSet;

use reim_schema::*;
use serde_derive::*;

const BASE_TYPE_NAMES : [&str; 7] = ["string", "String", "u32", "Uint32", "Int32", "Boolean", "Bytes"];

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WrapManifest {
  pub version: String,
  pub abi: WrapAbi
}

#[derive(Serialize, Deserialize, Debug, Clone, Eq, PartialEq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct TypeInfo {
  pub type_name: String,
  pub is_class: bool,
  pub is_base: bool,
  pub native_type_name: String,
  pub native_type_name_wrapped: String,
  pub required: bool,
  pub is_struct: bool,
}

impl TypeInfo {
    pub fn new(type_info: &Type, abi: &WrapAbi) -> TypeInfo {
        let is_base = BASE_TYPE_NAMES.contains(&type_info.type_name.as_str());
        let is_class = is_class(&type_info.type_name, abi);
        let is_struct = !is_base && !is_class;

        TypeInfo {
            type_name: type_info.type_name.clone(),
            required: type_info.required,
            native_type_name: type_info.type_name.clone(),
            native_type_name_wrapped: if is_class {
                type_info.type_name.clone() + "Wrapped"
            } else {
                type_info.type_name.clone()
            },
            is_base,
            is_class,
            is_struct,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NamedTypeInfo {
  pub name: String,
  pub type_info: TypeInfo,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FunctionModel {
  pub name: String,
  pub name_pascal_case: String,
  pub args: Vec<ListModel<NamedTypeInfo>>,
  pub result: TypeInfo,
  pub is_static: bool,
  pub is_external: bool,
  pub class_name: Option<String>,
  pub related_types: Vec<TypeInfo>,
}

impl FunctionModel {
    pub fn build(model: FunctionModel, class_def: Option<&TypeDefinition>) -> FunctionModel {
        let mut related_types = get_function_related_types(&model);
        if let Some(class_def) = class_def {
            related_types.push(TypeInfo {
                type_name: class_def.name.clone(),
                native_type_name: class_def.name.clone(),
                native_type_name_wrapped: class_def.name.clone() + "Wrapped",
                required: true,
                is_base: false,
                is_class: true,
                is_struct: false,
            });

            related_types = related_types.into_iter().collect::<HashSet<TypeInfo>>().into_iter().collect();
        }

        FunctionModel {
            name: model.name,
            name_pascal_case: model.name_pascal_case,
            args: model.args,
            result: model.result,
            is_static: model.is_static,
            is_external: model.is_external,
            class_name: model.class_name,
            related_types
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ListModel<T> {
  pub model: T,
  pub index: usize,
  pub first: bool,
  pub last: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct TypeModel {
  pub name: String,
  pub fields: Vec<ListModel<NamedTypeInfo>>,
  pub methods: Vec<ListModel<FunctionModel>>,
  pub is_class: bool,
  pub is_external: bool,
  pub is_struct: bool,
  pub related_types: Vec<TypeInfo>,
}

impl TypeModel {
    pub fn build(model: TypeModel) -> TypeModel {
        let related_types: Vec<TypeInfo> = 
            model.fields.iter()
                .map(|field| field.model.type_info.clone())
                .chain(model.methods.iter().flat_map(|method| get_function_related_types(&method.model)))
                .filter(|field| field.is_class || field.is_struct)
                .filter(|x| x.type_name != model.name)
                .collect::<HashSet<_>>()
                .into_iter()
                .collect();

        println!("{}, {:?}", model.name, related_types);
        TypeModel {
            name: model.name,
            is_class: model.is_class,
            is_external: model.is_external,
            is_struct: model.is_struct,
            fields: model.fields,
            methods: model.methods,
            related_types,
        }
    }
}

fn get_function_related_types(func: &FunctionModel) -> Vec<TypeInfo> {
    vec![
        func.result.clone()
    ]
    .into_iter()
    .chain(func.args.iter().map(|arg| arg.model.type_info.clone()))
    .filter(|field| field.is_class || field.is_struct)
    .collect::<HashSet<_>>()
    .into_iter()
    .collect()
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WrapperModel {
  pub wrapper_name: String,
  pub global_functions: Vec<ListModel<FunctionModel>>,
  pub types: Vec<ListModel<TypeModel>>,
}

fn is_class(type_name: &str, abi: &Vec<SchemaType>) -> bool {
    if BASE_TYPE_NAMES.contains(&type_name) {
        return false;
    }

    let type_info = abi.iter().find(|x| {
        match x {
            SchemaType::Type(type_info) => type_info.name == type_name,
            _ => false
        }
    });

    match type_info {
        Some(SchemaType::Type(type_info)) => type_info.is_class,
        _ => false
    }
}
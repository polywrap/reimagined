use serde_derive::*;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NamedType {
    pub name: String,
    pub type_info: Type,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Type {
    pub type_name: String,
    pub required: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PropertyInfo {
    pub name: String,
    pub type_info: Type,
    pub get: bool,
    pub set: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FunctionDefinition {
    pub name: String,
    pub args: Vec<NamedType>,
    pub result: Type,
    pub is_static: bool,
    pub is_external: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TypeDefinition {
    pub name: String,
    pub fields: Vec<NamedType>,
    pub properties: Vec<PropertyInfo>,
    pub methods: Vec<FunctionDefinition>,
    pub is_class: bool,
    pub is_external: bool,
    pub is_struct: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
#[serde(rename_all = "camelCase")]
pub enum SchemaType {
    Function(FunctionDefinition),
    Type(TypeDefinition),
}

pub type WrapAbi = Vec<SchemaType>;
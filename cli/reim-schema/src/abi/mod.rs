use serde_derive::*;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FieldInfo {
    pub name: String,
    pub type_name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ArgInfo {
    pub name: String,
    pub type_name: String
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PropertyInfo {
    pub name: String,
    pub type_name: String,
    pub get: bool,
    pub set: bool
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FunctionType {
    pub name: String,
    pub args: Vec<ArgInfo>,
    pub return_type: String
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ClassType {
    pub name: String,
    pub fields: Vec<FieldInfo>,
    pub properties: Vec<PropertyInfo>,
    pub methods: Vec<FunctionType>
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
#[serde(rename_all = "camelCase")]
pub enum SchemaType {
    Function(FunctionType),
    Class(ClassType)
}

pub type WrapAbi = Vec<SchemaType>;
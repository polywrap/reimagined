use serde_derive::*;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FieldInfo {
    pub name: Option<String>,
    pub type_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ArgInfo {
    pub name: Option<String>,
    pub type_name: Option<String>
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PropertyInfo {
    pub name: Option<String>,
    pub type_name: String,
    pub get: bool,
    pub set: bool
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FunctionType {
    pub name: Option<String>,
    pub args: Vec<ArgInfo>,
    pub return_type: Option<String>
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
#[serde(tag = "typeName")]
#[serde(rename_all = "camelCase")]
pub enum SchemaType {
    Function(FunctionType),
    Class(ClassType)
}

pub type WrapAbi = Vec<SchemaType>;
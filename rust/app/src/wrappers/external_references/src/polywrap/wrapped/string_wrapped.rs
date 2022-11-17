use std::str;

use serde::{Deserialize, Serialize};
use serde_json::json;

pub const CLASS_NAME: &str = "String";

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StringWrapped {
} 

impl StringWrapped {
    pub fn map_to_serializable(value: &String) -> String {
        value.clone()
    }

    pub fn serialize(value: &String) -> &[u8] {
        Self::serialize_wrapped(
            &Self::map_to_serializable(value)
        )
    }

    pub fn serialize_wrapped(value: &String) -> &[u8] {
        json!(
            value
        )
        .to_string()
        .as_bytes()
    }

    pub fn deserialize(buffer: &[u8]) -> String {
        Self::map_from_serializable(
            Self::deserialize_wrapped(buffer)
        )
    }

    pub fn deserialize_wrapped(buffer: &[u8]) -> String {
        serde_json::from_str(
            str::from_utf8(buffer).expect("Could not convert buffer to string")
        ).expect("JSON was not well-formatted")
    }

    pub fn map_from_serializable(value: String) -> String {
        value.clone()
    }
}

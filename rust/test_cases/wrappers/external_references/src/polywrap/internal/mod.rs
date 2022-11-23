pub mod invoke_class_method;
pub mod invoke_global_function;
pub mod wrapped;
pub mod internal_wrap_module;
pub use invoke_class_method::invoke_class_method;
pub use invoke_global_function::invoke as invoke_global_function;

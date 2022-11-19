use std::env;

fn main() {
}

#[cfg(test)]
mod tests {
    use reim_codegen::*;

    #[test]
    fn internal_function() -> Result<(), std::io::Error> {
        generate_wrap_manifest("./test/in".to_string(), "./test/out".to_string())?;
        generate_bindings("./test/in".to_string(), "./test/out".to_string(), &Language::Rust, &ModuleType::Host)?;
        panic!("TODO");
        Ok(())
    }
}
use std::env;

use reim_wrapper_codegen::*;
use reim_app_codegen::*;

fn main() -> Result<(), std::io::Error> {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        return Ok(());
    }

    let command = &args[1];

    match command.as_str() {
        "wrapper" => {
            let input_path = if args.len() < 3 { "." } else { &args[2] };
            let output_path = if args.len() < 4 { "./src" } else { &args[3] };
            
            println!("Generating wrapper bindings: {}/schema.graphql to {}/wrap/wrapped", input_path, output_path);

            generate_bindings(input_path.to_string(), output_path.to_string())?;
        },
        "manifest" => {
            let input_path = if args.len() < 3 { "." } else { &args[2] };
            let output_path = if args.len() < 4 { "./build" } else { &args[3] };
            
            println!("Generating wrapper bindings: {}/schema.graphql to {}", input_path, output_path);

            generate_wrap_manifest(input_path.to_string(), output_path.to_string())?;
        },
        "app" => {
            let input_path = if args.len() < 3 { "." } else { &args[2] };
            let output_path = if args.len() < 4 { "./src" } else { &args[3] };
            
            println!("Generating app binding: {}/schema.graphql to {}/wrap", input_path, output_path);

            generate_app_codegen(input_path.to_string(), output_path.to_string())?;
        },
        _ => {}
    }

    Ok(())
}

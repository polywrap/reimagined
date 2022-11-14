mod abi;
pub use abi::*;

use tree_sitter::{TreeCursor, Node};

pub fn parse_schema(source: String) -> WrapAbi {
    let mut parser = tree_sitter::Parser::new();
    parser.set_language(tree_sitter_wrap::language()).unwrap();

    let tree = parser.parse(&source, None).unwrap();
    
    let mut cursor = tree.walk();
    let mut type_info: Vec<SchemaType> = vec![];

    walk(&mut cursor, "TypeDefinition".into(), &mut |type_def_node| {
        walk(&mut type_def_node.walk(), "Name", &mut |name_node| {
            match name_node.utf8_text(source.as_bytes()) {
                Ok(name) => {
                    let mut schema_type: Option<SchemaType> = None;

                    walk(&mut type_def_node.walk(), "ObjectTypeDefinition", &mut |obj_def_node| {
                        let mut methods: Vec<FunctionDefinition> = vec![];
                        let mut fields: Vec<NamedType> = vec![];
                        let is_class = if get_directives(&obj_def_node, &source).contains(&"class".to_string()) { true } else { false };
                        let is_external = if get_directives(&obj_def_node, &source).contains(&"external".to_string()) { true } else { false };
                        let is_struct = if get_directives(&obj_def_node, &source).contains(&"struct".to_string()) { true } else { false };
                        if is_class && is_struct {
                            panic!("TypeDefinition cannot be both class and struct");
                        }

                        walk(&mut obj_def_node.walk(), "FieldDefinition", &mut |field_def_node| {
                            let field_name = get_name_from_node(&field_def_node, &source);

                            let directives = get_directives(&field_def_node, &source);
                            let is_method = if directives.contains(&"fn".to_string()) || directives.contains(&"staticFn".to_string()) || directives.contains(&"externalFn".to_string()) { true } else { false };

                            if is_method {
                                let mut args: Vec<NamedType> = vec![];
                                walk(&mut field_def_node.walk(), "InputValueDefinition", &mut |node| {
                                    args.push(NamedType {
                                        name: get_name_from_node(&node, &source),
                                        type_info: Type {
                                            type_name: get_named_type(&node, &source),
                                            required: true
                                        },
                                    });
                                    false
                                });

                                methods.push(FunctionDefinition {
                                    name: field_name,
                                    args: args,
                                    is_static: if directives.contains(&"staticFn".to_string()) { true } else { false },
                                    is_external: if directives.contains(&"externalFn".to_string()) { true } else { false },
                                    result: Type {
                                        type_name: get_named_type(&field_def_node, &source),
                                        required: true
                                    },
                                });
                            } else {
                                fields.push(NamedType {
                                    name: field_name,
                                    type_info: Type {
                                        type_name: get_named_type(&field_def_node, &source),
                                        required: true
                                    }
                                });
                            }
                            
                            false
                        });

                        schema_type = Some(SchemaType::Type(TypeDefinition {
                            name: name.to_string(),
                            fields: fields,
                            properties: vec![],
                            methods: methods,
                            is_class,
                            is_external,
                            is_struct
                        }));

                        true
                    });
                  
                    if schema_type.is_some() {
                    type_info.push(schema_type.unwrap());
                    }
                },
                Err(_) => {}
            }
            true
        });

        true
    });

    let global_functions = type_info
        .iter()
        .find(|x| {
            match x {
                SchemaType::Type(type_model) => {
                    type_model.name == "Module"
                },
                _ => false
            }
        })
        .map(|x| {
            match x {
                SchemaType::Type(type_model) => {
                type_model.methods
                        .iter()
                        .map(|x| {
                            SchemaType::Function(x.clone())
                        })
                        .collect()
                },
                _ => vec![]
            }
        });

    let mut abi: Vec<SchemaType> = type_info
        .into_iter()
        .filter(|x| {
            match x {
                SchemaType::Type(type_model) => {
                    type_model.name != "Module"
                },
                _ => true
            }
        })
        .collect();

    if let Some(global_functions) = global_functions {
        abi.extend(global_functions); 
    }

    abi
}

fn get_name_from_node(node: &Node, source: &str) -> String {
    let mut name: Option<String> = None;

    walk(&mut node.walk(), "Name", &mut |name_node| {
        match name_node.utf8_text(source.as_bytes()) {
            Ok(name_str) => name = Some(name_str.to_string()),
            Err(e) => {
                panic!("Name of node is not defined");
            }
        }
        true
    });

    if name.is_none() {
        panic!("Name of node not found");
    }

    name.unwrap()
}

fn get_named_type(node: &Node, source: &str) -> String {
    let mut name: Option<String> = None;

    walk(&mut node.walk(), "NamedType", &mut |name_node| {
    name = Some(get_name_from_node(&name_node, source));
    true
    });

    if name.is_none() {
    panic!("NamedType of node not found");
    }

  name.unwrap()
}


fn get_directives(node: &Node, source: &str) -> Vec<String> {
  let mut names: Vec<String> = vec![];

  walk(&mut node.walk(), "Directive", &mut |name_node| {
    let name = get_name_from_node(&name_node, source);
    names.push(name.clone());
    false
  });

  names
}

fn walk<F: FnMut(Node) -> bool>(cursor: &mut TreeCursor, node_kind: &str, on_node_kind: &mut F) {
  let succ = cursor.goto_first_child();
  if !succ {
      return;
  }

  loop {
      let node = cursor.node();
      let kind = node.kind();
      let node = cursor.node();
      let kind = node.kind();
  
      if kind == node_kind {
          let should_end = on_node_kind(node);
          if should_end {
              return;
          }
      }
  
      walk(&mut node.walk(), &node_kind, on_node_kind);

      let succ = cursor.goto_next_sibling();
      if !succ {
          break;
      }
  }
}
#[cfg(test)]
mod tests {
    use crate::{parse_schema};

    #[test]
    fn internal_function() -> Result<(), std::io::Error> {
        let schema = "type TestClass {
          constructor(arg: string): void
          instanceMethod(arg: string): string @instance
          staticMethod(arg: string): string
        }".to_string(); 
      
        println!("{:?}", parse_schema(schema));

        Ok(())
    }
}
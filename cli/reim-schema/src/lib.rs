mod abi;
pub use abi::*;

use tree_sitter::{TreeCursor, Node};

pub const SCALAR_TYPE_NAMES : [&str; 5] = ["String", "Uint32", "Int32", "Boolean", "Bytes"];

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
                      let mut methods: Vec<FunctionType> = vec![];
                      let mut fields: Vec<FieldInfo> = vec![];
                      
                      walk(&mut obj_def_node.walk(), "FieldDefinition", &mut |field_def_node| {
                          let field_name = get_name_from_node(&field_def_node, &source);

                          let mut is_method = false;

                          match field_def_node.utf8_text(source.as_bytes()) {
                            Ok(name) =>  if name.contains("(") && name.contains(")") {
                              is_method = true;
                            },
                            Err(e) => println!("{:?}", e)
                          }

                          if is_method {
                            let mut args: Vec<ArgInfo> = vec![];
                            walk(&mut field_def_node.walk(), "InputValueDefinition", &mut |node| {
                              args.push(ArgInfo {
                                name: get_name_from_node(&node, &source),
                                type_name: get_named_type(&node, &source)
                              });
                              false
                            });

                            methods.push(FunctionType {
                              name: field_name,
                              args: args,
                              return_type: get_named_type(&field_def_node, &source),
                              is_instance: if let Some(x) = get_directive(&field_def_node, &source) && x == "instance" { true } else { false },
                            });
                          } else {
                            fields.push(FieldInfo {
                              name: field_name,
                              type_name: get_named_type(&field_def_node, &source)
                            });
                          }
                          
                          false
                      });

                      schema_type = Some(SchemaType::Class(ClassType {
                          name: name.to_string(),
                          fields: fields,
                          properties: vec![],
                          methods: methods
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
            SchemaType::Class(class) => {
                class.name == "Module"
            },
            _ => false
        }
    })
    .map(|x| {
        match x {
            SchemaType::Class(class) => {
                class.methods
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
            SchemaType::Class(class) => {
                class.name != "Module"
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
            println!("{:?}", e);
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


fn get_directive(node: &Node, source: &str) -> Option<String> {
  let mut name: Option<String> = None;

  walk(&mut node.walk(), "Directive", &mut |name_node| {
  name = Some(get_name_from_node(&name_node, source));
  true
  });

  name
}

fn walk<F: FnMut(Node) -> bool>(cursor: &mut TreeCursor, node_kind: &str, on_node_kind: &mut F) {
  let succ = cursor.goto_first_child();
  if !succ {
      return;
  }

  loop {
      let node = cursor.node();
      let kind = node.kind();
      println!("Kind {:?}", kind);
      println!("type {:?}", cursor.node());

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
          println!("success {:?}", succ);
          break;
      }

      println!("next");
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
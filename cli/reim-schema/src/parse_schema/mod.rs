use crate::abi::*;
use tree_sitter::{TreeCursor, Node};

pub fn parse_schema(source: String) -> WrapAbi {
  let mut parser = tree_sitter::Parser::new();
  parser.set_language(tree_sitter_wrap::language()).unwrap();

  let tree = parser.parse(&source, None).unwrap();
  
  let mut cursor = tree.walk();
  let mut typeInfo: Vec<SchemaType> = vec![];

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
                              return_type: get_named_type(&field_def_node, &source)
                            });
                          } else {
                            fields.push(FieldInfo {
                              name: field_name,
                              type_name: "String".to_string()
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
                      typeInfo.push(schema_type.unwrap());
                  }
              },
              Err(_) => {}
          }
          true
      });

      true
  });

  typeInfo
}

pub fn get_name_from_node(node: &Node, source: &str) -> Option<String> {
  let mut name: Option<String> = None;

  walk(&mut node.walk(), "Name", &mut |name_node| {
    match name_node.utf8_text(source.as_bytes()) {
        Ok(name_str) => name = Some(name_str.to_string()),
        Err(e) => println!("{:?}", e)
    }
    true
  });

  name
}

pub fn get_named_type(node: &Node, source: &str) -> Option<String> {
  let mut name: Option<String> = None;

  walk(&mut node.walk(), "NamedType", &mut |name_node| {
    name = get_name_from_node(&name_node, source);
    true
  });

  name
}

pub fn walk<F: FnMut(Node) -> bool>(cursor: &mut TreeCursor, node_kind: &str, on_node_kind: &mut F) {
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
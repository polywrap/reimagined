@external("wrap", "__wrap_instantiate_args")
export declare function __wrap_instantiate_args(class_name_ptr: u32, args_ptr: u32): void;

@external("wrap", "__wrap_invoke_instance_args")
export declare function __wrap_invoke_instance_args(class_name_ptr: u32, method_ptr: u32, args_ptr: u32): void;

@external("wrap", "__wrap_invoke_instance")
export declare function __wrap_invoke_instance(wrap_instance_ptr: u32, class_instance_ptr: u32, method_ptr: u32, method_name_size: u32, args_ptr: u32, args_size: u32): bool;

@external("wrap", "__wrap_invoke_instance_result_len")
export declare function __wrap_invoke_instance_result_len(): u32;

@external("wrap", "__wrap_invoke_instance_result")
export declare function __wrap_invoke_instance_result(args_ptr: u32): void;

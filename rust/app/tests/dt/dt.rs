fn main() {
}

#[cfg(test)]
mod tests {
    use reim_host_dt_wasm::wasm_runtime::instance::WasmModule;

    #[test]
    fn test() {
        let dt_module = DtWasmModule::new(WasmModule::Path(&"./dt.wasm"));
    }
}
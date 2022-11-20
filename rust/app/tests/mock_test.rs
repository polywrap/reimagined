mod app;

fn main() {
}

#[cfg(test)]
mod tests {
    use crate::app::*;

    #[test]
    fn test() {
        testReceiveReference();
    }
}
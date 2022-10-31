@serializable
export class Args {
  constructor(
    public objectReferencePtr: u32,
    public args: MethodArgs
  ) {}
}

@serializable
export class MethodArgs {
  constructor(
    public arg: string
  ) {}
}

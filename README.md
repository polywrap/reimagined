# Polywrap Reimagined

## Goals
- Redesign client and runtime from the ground up with app and wrapper dev exp in mind
- Build a layered system instead of a client focused one
- Wasm Wrappers should be cross platform, secure SDKs
  - Wasm Wrappers are currently stateless micro services
    - Missing:
      - Passing references
          - Between wrappers
          - From app to wrapper
          - From wrapper to app
          - Function object and function references
      - State (optional)
      - Multiple classes per module
      - Class instantiation
- Wrappers could be more than wasm and plugins:
  - Rest APIs
  - Micro services
  - Web socket services
  - Any external code/system
- Potentially have similar app and wrapper dev exp

### Think about
- Packages, instances, cache and loading with URIs
- Identifiers and URIs and what is the difference
- Security/Permissions/Capabilities from the ground up
- Client (engine) turned into parts instead of monolith


## Dev experience
- Needs to be as close to traditional libraries as possible
- Potentially take inspiration from typechain's codegen for smart contracts 
```typescript=
const ethereumPackage: IWrapPackage = loader.load("ens/ethereum.eth");
const uniswapPackage: IWrapPackage = loader.load("ens/uniswap.eth");

const ethereumWrapper: IWrapInstance = ethereumPackage.createWrapper();
const uniswapWrapper: IWrapInstance = uniswapPackage.createWrapper();

const provider: IEthereumProvider = await EthereumProvider__factory.fromWrapper(ethereumWrapper, { rpcUrl });
const uniswap: IUniswap = await Uniswap__factory.fromWrapper(uniswapWrapper, { provider });

await uniswap.swap("eth", "dai", 10);
```

## Schema experience
```graphql=
#import { IEthereumProvider } into Ethereum from "@ethereum-interface"
#import { ILogger } into Diagnostics from "diagnostics-interface"
#import { IClient, @require } into Polywrap from "polywrap-interface"

module {
  constructor(
    Polywrap.@require(
      uris: [
        "diagnostics.eth"
      ]
    )
    client: Polywrap.IClient!
    http: Http!
  ): void
}

type Http {
  get(env: Env): String
}

type Test {
  constructor(logger: Diagnostics.ILogger!): void
  run: String
}

type Test2 {
  constructor(loader: Polywrap.IPackageLoader!): void
  run: String
}

type Uniswap {
  constructor(
    Polywrap.@require(
      uris: [
        "http.eth"
      ]
    )
    client: Polywrap.PolywrapClient!
  ): void
  swap(from: String!, to: String!, amount: Uint!): ITransaction!;
}

interface ITransaction {
  id: String!
  wait(confirmations: Uint!): Receipt
}

type Receipt {
  blockNumber: String!;
}
```

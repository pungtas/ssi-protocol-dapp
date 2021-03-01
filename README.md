![tyron](./src/assets/images/tyron.png)

```own your data, empower your world```

Welcome to the open-source dapp for the [Self-Sovereign Identity (SSI) Protocol](https://www.ssiprotocol.com).

## xTransfer

Send $ZIL over an SSI Bridge and transfer it on Solana as a wrapped cryptocurrency named xZIL. Transfer this virtual asset along with the originator's personal information to counteract the financing of terrorism and money laundering. This message powered on Solana is encrypted so that only the beneficiary can read it.

Virtual Asset Service Providers (VASPs) involved in an xTransfer comply with the data-sharing requirements stipulated by the Financial Action Task Force (FATF) Travel Rule while focusing on principle #7 of Privacy by Design: "Respect for user privacy — keep it user-centric".

The SSI Protocol integrates the following specifications:

- [Decentralized Identifiers (DIDs) v1.0](https://w3c.github.io/did-core/) by the World Wide Web Consortium (W3C). The tyronzil DID Method also registered in the [W3C DID Specification Registries](https://w3c.github.io/did-spec-registries/).

- [InterVASP Messaging Standard IVMS101](https://intervasp.org/wp-content/uploads/2020/05/IVMS101-interVASP-data-model-standard-issue-1-FINAL.pdf) by the Joint Working Group on interVASP Messaging Standards.



## Contributing

It'd be great to have your help! :zap:

> [Contributing guideline](./CONTRIBUTING.md)

> [Code of conduct](./CODE_OF_CONDUCT.md)

> [Open-source license](./LICENSE)

# Testing

User SSI's keys:

Private key:

```0937d53364ae36bf3343c97e4a449d1edb0ec84c88f3f1ea89a0a18c6779fc6a```

Public key:

```0x031aae1831994cd255c9ef7417eadf36d19494df23aeffe0e94164cb7e40d7f3cb```

## Environment Setup
1. Install Rust from https://rustup.rs/
2. Install Solana v1.5.0 or later from https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool
3. Install Node.js
4. Install NPM

## Quickstart

```bash
git clone https://github.com/pungtas/ssi-protocol-dapp.git

cd ssi-protocol-dapp
```

```bash
npm install
```

```bash
npm start
```

### Build and test for program compiled natively

```bash
cd program
```
```bash
cargo build
```

```bash
cargo test
```

### Build and test the program compiled for BPF

```bash
cargo build-bpf
cargo test-bpf
```

# Directory structure

## program

Solana program template in Rust

### src/lib.rs
* process_instruction function is used to run all calls issued to the smart contract

## src/actions

Setup here actions that will interact with Solana programs using sendTransaction function

## src/contexts

React context objects that are used propagate state of accounts across the application

## src/hooks

Generic react hooks to interact with token program:
* useUserBalance - query for balance of any user token by mint, returns:
    - balance
    - balanceLamports
    - balanceInUSD
* useAccountByMint
* useTokenName
* useUserAccounts

## src/views

* home - main page for your app
* faucet - airdrops SOL on Testnet and Devnet

Transparent but trustworthy.
Multichain integration accross a bridge.
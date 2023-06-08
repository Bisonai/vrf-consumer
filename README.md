# VRF Consumer

Consumer smart contract that utilizes VRF functionality from [Orakl Network](https://www.orakl.network).

> Warning: This repository and smart contract are meant to be for deployment on [`Baobab`](https://docs.klaytn.foundation/misc/faq#what-is-cypress-what-is-baobab).

Internally, the scripts access following smart contracts:

- `Prepayment` ([0x75e604c28b7e90af3019ae6982b294a70adc3581](https://baobab.scope.klaytn.com/account/0x75e604c28b7e90af3019ae6982b294a70adc3581))
- `VRFCoordinator` ([0xfa605ca6dc9414e0f7fa322d3fd76535b33f7a4f](https://baobab.scope.klaytn.com/account/0xfa605ca6dc9414e0f7fa322d3fd76535b33f7a4f))

If you want to access different deployments of `Prepayment` or `VRFCoordinator`, you can change it inside `hardhat.config.ts` in `namedAccounts` property.

## Prerequisites

Create a copy of `.env.example` file and fill in values for `PROVIDER`, and `MNEMONIC` or `PRIV_KEY` (the difference is explained below) environment variables.
These variables will be used for connection to JSON-RPC endpoint, deployment and use of your [`VRFConsumer` smart contract](contracts/VRFConsumer.sol).

```shell
cp .env.example .env
```

`PROVIDER` can be set to any JSON-RPC endpoint.
The list of free available JSON-RPC endpoint can be found in [official Klaytn documentation](https://docs.klaytn.foundation/content/dapp/rpc-service/public-en#testnet-baobab-public-json-rpc-endpoints).

This repository supports connection to wallet either through mnemonic or private key.

### Mnemonic

`MNEMONIC` can be generated using [npm mnemonics package](https://www.npmjs.com/package/mnemonics).

```shell
npx mnemonics
```

After mnemonic is generated, you need to convert it to public address and fund it with KLAY.
If you do not have any KLAY in your account, you cannot deploy smart contracts or make any transactions.

You can convert your newly generated mnemonic with following hardhat task.
Please replace the `[MENONIC]` with your mnemonic.

```shell
npx hardhat address --mnemonic [MNEMONIC]
```

The script will print out a public address corresponding to your mnemonic.
Then, you can use this address to receive free KLAY using [Baobab's faucet](https://baobab.wallet.klaytn.foundation/faucet).

### Private key

If you already have a wallet, you can reuse its private key, and connect to JSON-RPC endpoint with it.
In case you use Metamask, read [how to export an account's private key.](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).
After you extract private key, store it in `PRIV_KEY` variable inside of `.env` file.

## Installation

```shell
yarn install
```

## Compilation

```shell
yarn compile
```

## Deploy

```shell
npx hardhat deploy --network baobab
```

## Create and fund account

There are two types of payments supported by Orakle Network VRF: **Prepayment** and **Direct Payment**.

**Prepayment** requires user to create account and fund it with KLAY before being able to use it.
The script below will create a new account and deposit 1 KLAY from address corresponding to your mnemonic from `.env` file.

If you prefer to use Orakl Network VRF without having a long-lasting account, you can use **Direct Payment** method.
In such case, you can skip the following command and go directly to **Request VRF with Direct Payment**.

```shell
npx hardhat run scripts/create-and-fund-account.ts --network baobab
```

After successfully executing the command above, set the value of environment variable `ACC_ID` inside of `.env` file to account ID that was generated using the script above.
If you do not do it, the request for VRF using Prepayment won't be working properly.
After setting the `ACC_ID` in `.env` file, you can move to the next step **Request VRF with Prepayment**.

## Request & Read VRF

Before running following scripts, one must deploy `VRFConsumer` smart contract.
To deploy `VRFConsumer`, run `npx hardhat deploy --network baobab`.

### Request VRF with Prepayment

```shell
npx hardhat run scripts/request-vrf.ts --network baobab
```

### Request VRF with Direct Payment

```shell
npx hardhat run scripts/request-vrf-direct.ts --network baobab
```

### Read VRF response

```shell
npx hardhat run scripts/read-vrf.ts --network baobab
```

## Hardhat tasks

The following tasks allow for more finer control experimentation with the example code in this repository.

### Create a new account

```shell
npx hardhat createAccount --network baobab
```

### Deposit to an account

After you have created an account, you can deposit $KLAY to it anytime using the command below.

```shell
npx hardhat deposit \
    --account-id $ACCOUNT \
    --amount $AMOUNT \
    --network $NETWORK
```

### Withdraw from an account

To withdraw the remaining balance from an account, you can use the command below.

```shell
npx hardhat withdraw \
    --account-id $ACCOUNT \
    --amount $AMOUNT \
    --network $NETWORK
```

### Add a consumer

Add consumer contract to account.
Then, the consumer contract will be able to request for VRF service.

```shell
npx hardhat addConsumer \
    --consumer $CONSUMERADDRESS \
    --account-id $ACCOUNT \
    --network $NETWORK
```

### Remove a consumer

Remove a consumer contract from an account.
Then, the consumer contract will not be able to request for VRF service anymore.

```shell
npx hardhat removeConsumer \
    --consumer ${CONSUMERADDRESS} \
    --account-id ${ACCOUNT} \
    --network ${NETWORK}
```

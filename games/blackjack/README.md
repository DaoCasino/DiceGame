# Black Jack Contract and Game

## Dependencies
This repository uses Truffle to compile, test and deploy smart contracts.

It can be installed:
`npm install -g truffle`

For more information about truffle visit https://truffle.readthedocs.io/en/latest/

Also running node with active json-rpc is required. For testing puproses we suggest using https://github.com/ethereumjs/testrpc

## Usage
`./serve/run_testrpc.sh` - runs testrpc node with required params

`truffle compile` - compile all contracts

`truffle test` - run tests

## Alternative workflow

`./serve/install.sh` - installs Yarn package manager. It is faster than npm ([https://yarnpkg.com/en/](https://yarnpkg.com/en/))

Optionally: `yarn install` - installs all npm packages. This command is included into install.sh script

### Testrpc
In separate terminal window run — `./serve/run_testrpc_local.sh`. This will launch up testrpc

`./serve/run_app_local.sh` - launches the app on [http://localhost:8080](http://localhost:8080)

### Testnet
In separate terminal window run — `./serve/geth_testnet.sh`. This will launch up geth on the testnet.

`./serve/run_testnet.sh` - deploys the contracts on the testnet and launches the app on [http://localhost:8080](http://localhost:8080)

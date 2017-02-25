#!/bin/bash
account=`geth --keystore keystore --testnet account list | head -n 1 | awk '{print substr($3,2,40)}'`
geth --keystore keystore --testnet --rpc --rpccorsdomain="http://localhost:8080" --unlock $account --password serve/.pass 

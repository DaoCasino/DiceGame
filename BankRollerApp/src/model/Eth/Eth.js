/*
 * Wrapper for all Ethereum methods
 * RPC, ligthWallet, and custom functions
 *
 **/

import _config from 'app.config'
import RPC     from './RPC'
import Wallet  from './Wallet'

import Web3 from 'web3'
const web3 = new Web3()

import * as Utils from 'utils'

const rpc    = new RPC(_config.HttpProviders.infura.url)
const wallet = new Wallet()

class Eth {
	constructor(provider_url){
		this.RPC    = rpc
		this.Wallet = wallet
	}

	deployContract(contract_bytecode, callback){

		let checkContractDeployed = (transaction_hash, callback)=>{ setTimeout(()=>{
			console.log('checkContractDeployed', 'https://rinkeby.etherscan.io/tx/'+transaction_hash)

			this.RPC.request('getTransactionReceipt', [transaction_hash]).then( response => {

				console.log('checkContractDeployed result', response.result)

				if (!response || !response.result || !response.result.contractAddress) {
					checkContractDeployed(transaction_hash, callback)
					return
				}

				console.log('[OK] checkContractDeployed - address:', 'https://rinkeby.etherscan.io/address/'+response.result.contractAddress)

				callback(response.result.contractAddress)
			}).catch( err => {
				console.error('checkContractDeployed:', err)
				checkContractDeployed(transaction_hash, callback)
			})
		}, 9000)}

		this.Wallet.signTx({
			data:     contract_bytecode,
			gasLimit: 0x4630C0,
			gasPrice: '0x737be7600',
			value:    0
		}, signedTx => {
			// id 0
			this.RPC.request('sendRawTransaction', ['0x' + signedTx]).then( response => {
				if (!response.result) { return }
				checkContractDeployed(response.result, callback)
			})
		})
	}



	getBetsBalance(address, callback){
		// Call contract function balanceOf
		// https://github.com/ethereum/homestead-guide/blob/master/source/contracts-and-transactions/accessing-contracts-and-transactions.rst#interacting-with-smart-contracts
		// function hasnae is first 4 bytes of sha3 of string with function name with params types
		let data  = web3.sha3('balanceOf(address)').substr(0,10)
				  + Utils.pad(Utils.numToHex(address.substr(2)), 64)

		this.RPC.request('call', [{
			'from': this.Wallet.get().openkey,
			'to':   _config.contracts.erc20.address,
			'data': data
		}, 'latest']
		).then( response => {
			console.log('response',response)
			callback( Utils.hexToNum(response.result) / 100000000 )
		}).catch( err => {
			console.error(err)
		})
	}

}

export default new Eth()
export {rpc as RPC, wallet as Wallet}

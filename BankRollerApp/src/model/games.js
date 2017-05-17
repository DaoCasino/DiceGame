import $          from 'jquery'
import _config    from '../app.config.js'
import Wallet     from './wallet.js'
import localDB    from 'localforage'
// import Web3       from 'web3'

// let web3 = new Web3()
// web3.setProvider(new web3.providers.HttpProvider(_config.HttpProviders.infura.url))


import * as Utils from './utils.js'



const {AsyncPriorityQueue, AsyncTask} = require('async-priority-queue')

class Games {
	constructor(){
		this._games = {}
		this.load()

		this.seeds_list = {}

		this.getCurBlock()

		this.Queue = new AsyncPriorityQueue({
			debug:               false,
			maxParallel:         1,
			processingFrequency: 350,
		})

		this.Queue.start()
	}

	load(callback){
		console.log('[Games] load...')
		localDB.getItem('Games', (err, games)=>{
			if (games) {
				this._games = games
			}
			if (callback) callback(games)
		})
	}

	get(callback){
		console.log('[Games] get...')
		if (this._games && Object.keys(this._games).length ) {
			callback(this._games)
			return
		}
		this.load(callback)
	}


	create(name, callback){
		this.deployContract(name, (address)=>{
			this.add(address, callback)

			// add bets to contract
			fetch( _config.api_url+'?a=faucet&network='+_config.network+'&to='+address ).then((response)=>{
				return response.text()
			}).then((result)=>{
				console.groupCollapsed('Add bets to '+address+' result:')
				console.log(result)
				console.groupEnd()

			})

			callback(address)
		})
	}

	deployContract(name, callback){
		let checkContractDeployed = (transaction_hash, callback)=>{
			console.log('checkContractDeployed', 'https://rinkeby.etherscan.io/tx/'+transaction_hash)

			$.ajax({
				type:     'POST',
				url:      _config.HttpProviders.infura.url,
				dataType: 'json',
				async:    false,

				data: JSON.stringify({
					'id': 1,
					'jsonrpc': '2.0',
					'method': 'eth_getTransactionReceipt',
					'params': [transaction_hash]
				}),
				success: function (response) {
					console.log('checkContractDeployed result', response.result)
					if (!response || !response.result || !response.result.contractAddress) {
						setTimeout(()=>{
							checkContractDeployed(transaction_hash, callback)
						}, 9000)
						return
					}

					console.log('[OK] checkContractDeployed - address:', 'https://rinkeby.etherscan.io/address/'+response.result.contractAddress)

					callback(response.result.contractAddress)
				}
			})
		}

		Wallet.signTx({
			data:     _config.contracts[name].bytecode,
			gasLimit: 0x4630C0,
			gasPrice: '0x737be7600',
			value:    0
		}, (signedTx)=>{
			$.ajax({
				type:     'POST',
				url:      _config.HttpProviders.infura.url,
				dataType: 'json',
				async:    false,

				data: JSON.stringify({
					'id': 0,
					'jsonrpc': '2.0',
					'method': 'eth_sendRawTransaction',
					'params': ['0x' + signedTx]
				}),
				success: (d)=>{
					if (!d.result) {
						return
					}
					let transaction_hash = d.result
					console.info('Create contract '+name+' transaction:', transaction_hash)
					setTimeout(()=>{
						checkContractDeployed(transaction_hash, callback)
					}, 5000)
				}
			})
		})
	}


	add(contract_id, callback){
		console.groupCollapsed('[Games] add ' + contract_id)

		this._games[contract_id] = {}

		localDB.setItem('Games', this._games)

		console.log('Get game balance')
		this.getBalance(contract_id, (balance)=>{

			console.info('balance', balance)

			this._games[contract_id].balance = balance
			if (!this._games[contract_id].start_balance) {
				this._games[contract_id].start_balance = balance
			}

			localDB.setItem('Games', this._games)

			console.groupEnd()

			if (callback) callback()
		})
	}

	remove(contract_id){
		delete(this._games[contract_id])
		localDB.setItem('Games', this._games)
	}

	getBalance(address, callback){
		let data = _config.contracts.erc20.balanceOf + Utils.pad(Utils.numToHex(address.substr(2)), 64)

		$.ajax({
			type:     'POST',
			url:      _config.HttpProviders.infura.url,
			dataType: 'json',
			async:    false,
			data: JSON.stringify({
				'id': 0,
				'jsonrpc': '2.0',
				'method': 'eth_call',
				'params': [{
					'from': Wallet.get().openkey,
					'to':   _config.contracts.erc20.address,
					'data': data
				}, 'latest']
			}),
			success: (d)=>{
				callback( Utils.hexToNum(d.result) / 100000000 )
			}
		})
	}


	runUpdateBalance(){
		this.get((games)=>{
			for(let contract_id in games){
				this.getBalance(contract_id, (balance)=>{
					this._games[contract_id].balance = balance
					localDB.setItem('Games', this._games)
				})
			}
		})
	}

	runConfirm(){
		localDB.getItem('seeds_list', (err, seeds_list)=>{
			if (!err && seeds_list) {
				this.seeds_list = seeds_list
			}

			this.get((games)=>{
				if (!games || !Object.keys(games).length) {
					setTimeout(()=>{
						this.runConfirm()
					}, 2*_config.confirm_timeout )
					return
				}

				for(let address in games){
					this.getLogs(address, (r)=>{
						console.log('[UPD] Games.getLogs '+address+' res:',r)

						setTimeout(()=>{
							this.runConfirm()
						}, _config.confirm_timeout )
					})
				}
			})
		})
	}

	getCurBlock(){
		$.ajax({
			type:     'POST',
			url:      _config.HttpProviders.infura.url,
			dataType: 'json',
			async:    false,

			data: JSON.stringify({
				'id': 74,
				'jsonrpc': '2.0',
				'method': 'eth_blockNumber',
				'params': []
			}),
			success: (d)=>{
				if (d && d.result) {
					this.curBlock = d.result
				}
			}
		})
	}

	getLogs(address, callback){
		console.log('curBlock:', this.curBlock)

		// Our server
		$.getJSON('https://platform.dao.casino/api/proxy.php?a=unconfirmed', {address:address},(seeds)=>{
			console.info('unconfirmed from server:'+seeds)
			if (seeds && seeds.length) {
				seeds.forEach((seed)=>{
					if (!this.seeds_list[seed]) {
						this.seeds_list[seed] = {
							contract:address
						}
					}
					this.sendRandom2Server(address, seed)
				})
			}
		})


		// Blockchain
		$.ajax({
			url:      _config.HttpProviders.infura.url,
			type:     'POST',
			dataType: 'json',
			async:    false,

			data:JSON.stringify({
				'id':      74,
				'jsonrpc': '2.0',
				'method':  'eth_getLogs',

				'params': [{
					'address':   address,
					'fromBlock': this.curBlock,
					'toBlock':   'latest',
				}]
			}),
			success: (objData)=>{
				if(!objData.result){ callback(null); return }

				for (let i = 0; i < objData.result.length; i++) {
					let obj = objData.result[i]

					this.curBlock = obj.blockNumber

					let seed = obj.data

					if (!this.seeds_list[seed]) {
						this.seeds_list[seed] = {
							contract:address
						}
					}
					if (!this.seeds_list[seed].confirm_sended_blockchain) {
						this.addTaskSendRandom(address, seed)
					}
				}

				callback(objData.result)
				return
			}
		})
	}


	addTaskSendRandom(address, seed, callback=false, repeat_on_error=3){
		let task = new AsyncTask({
			priority: 'low',
			callback:()=>{
				return new Promise((resolve, reject) => {
					try	{
						this.sendRandom(address, seed, (ok, result)=>{
							if (ok) {
								resolve( result )
							} else {
								reject( result )
							}
						})
					} catch(e){
						reject(e)
					}
				})
			},
		})

		task.promise.then(
			(result)=>{
				if (callback) callback(result)
			},
			// Ошибка
			(e)=>{
				if (repeat_on_error>0) {
					repeat_on_error--
					this.addTaskSendRandom(address, seed, callback, repeat_on_error)
				}
			}
		)

		this.Queue.enqueue(task)
	}

	checkPending(address, seed, callback){
		if (this.seeds_list[seed].pending) {
			callback()
		}

		if (!this.pendings) {
			this.pendings = {}
		}
		if (!this.pendings[address+'_'+seed]) {
			this.pendings[address+'_'+seed] = 0
		}
		this.pendings[address+'_'+seed]++
		if (this.pendings[address+'_'+seed] > 5) {
			return
		}

		$.ajax({
			type:     'POST',
			url:      _config.HttpProviders.infura.url,
			dataType: 'json',
			async:    false,
			data: JSON.stringify({
				'id': 0,
				'jsonrpc': '2.0',
				'method': 'eth_call',
				'params': [{
					'to':   address,
					'data': '0xa7222dcd'+seed.substr(2)
				}, 'pending']
			}),

			success: (response)=>{
				console.log('>> Pending response:', response)
				if (response.result && response.result.split('0').join('').length > 4) {
					this.seeds_list[seed].pending = true
					delete( this.pendings[address+'_'+seed] )
					callback()
				} else {
					this.seeds_list[seed].pending = false
				}
			}
		})
	}

	sendRandom2Server(address, seed){
		if (this.seeds_list[seed] && this.seeds_list[seed].confirm_sended_server) {
			return
		}

		// this.checkPending(address, seed, ()=>{
		Wallet.getConfirmNumber(seed, address, _config.contracts.dice.abi, (confirm, PwDerivedKey)=>{
			$.get(_config.api_url+'proxy.php?a=confirm', {
				vconcat: seed,
				result:  confirm
			}, ()=>{
				this.seeds_list[seed].confirm_server_time   = new Date().getTime()
				this.seeds_list[seed].confirm               = confirm
				this.seeds_list[seed].confirm_server        = confirm
				this.seeds_list[seed].confirm_sended_server = true

				localDB.setItem('seeds_list', this.seeds_list, ()=>{ })

			})
		})
		// })
	}

	sendRandom(address, seed, callback){
		if (this.seeds_list[seed] && this.seeds_list[seed].confirm_sended_blockchain) {
			return
		}

		Wallet.getSignedTx(seed, address, _config.contracts.dice.abi, (signedTx, confirm)=>{

			$.get('https://platform.dao.casino/api/proxy.php?a=confirm', {
				vconcat: seed,
				result:  confirm
			}, ()=>{})

			console.log('getSignedTx result:', seed, confirm)

			$.ajax({
				type:     'POST',
				url:      _config.HttpProviders.infura.url,
				dataType: 'json',
				async:    false,

				data: JSON.stringify({
					'id':      0,
					'jsonrpc': '2.0',
					'method':  'eth_sendRawTransaction',
					'params':  ['0x'+signedTx]
				}),
				success:(d)=>{
					this.seeds_list[seed].confirm_blockchain_time   = new Date().getTime()
					this.seeds_list[seed].confirm_sended_blockchain = true
					this.seeds_list[seed].confirm                   = confirm
					this.seeds_list[seed].confirm_blockchain        = confirm

					let r = false
					if (d.result) {
						r = true
					}

					localDB.setItem('seeds_list', this.seeds_list, ()=>{
						callback(r, d)
					})

					return
				}
			})
		})
	}

}

export default new Games()

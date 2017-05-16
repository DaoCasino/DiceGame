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

		this.sended_randoms = {}

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

	deployContract(name, callback){
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
				success: function (d) {
					console.log(d)
					callback(d)
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
			async:    true,
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
		localDB.getItem('sended_randoms', (err, sended_randoms)=>{
			if (!err && sended_randoms) {
				this.sended_randoms = sended_randoms
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


	getLogs(address, callback){
		if (!this.curBlock) {
			this.curBlock = 890686
		}

		let curBlockHex = '0x' + Utils.numToHex(this.curBlock)


		// Our server
		$.getJSON('https://platform.dao.casino/api/proxy.php?a=unconfirmed', {address:address},(seeds)=>{
			console.info('unconfirmed from server:'+seeds)
			if (seeds && seeds.length) {
				seeds.forEach((seed)=>{
					this.sendRandom2Server(address, seed)
				})
			}
		})


		// Blockchain
		$.ajax({
			url:      _config.HttpProviders.infura.url,
			type:     'POST',
			dataType: 'json',
			async:    true,

			data:JSON.stringify({
				'id':      74,
				'jsonrpc': '2.0',
				'method':  'eth_getLogs',

				'params': [{
					'address':   address,
					'fromBlock': curBlockHex,
					'toBlock':   'latest',
				}]
			}),
			success: (objData)=>{
				if(!objData.result){ callback(null); return }

				for (let i = 0; i < objData.result.length; i++) {
					let obj = objData.result[i]

					this.curBlock = Utils.hexToNum( obj.blockNumber.substr(2) )

					let seed = obj.data

					if (!this.sended_randoms[seed]) {
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
			async:    true,
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
					delete( this.pendings[address+'_'+seed] )
					callback()
				}
			}
		})
	}

	sendRandom2Server(address, seed){
		this.checkPending(address, seed, ()=>{
			Wallet.getConfirmNumber(seed, address, _config.contracts.dice.abi, (confirm, PwDerivedKey)=>{
				$.get('https://platform.dao.casino/api/proxy.php?a=confirm', {
					vconcat: seed,
					result:  confirm
				}, ()=>{})
			})
		})
	}

	sendRandom(address, seed, callback){
		if (this.sended_randoms[seed]) {
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
				async:    true,

				data: JSON.stringify({
					'id':      0,
					'jsonrpc': '2.0',
					'method':  'eth_sendRawTransaction',
					'params':  ['0x'+signedTx]
				}),
				success:(d)=>{
					this.sended_randoms[seed] = true
					let r = false
					if (d.result) {
						// console.log(d.result)
						r = true
					}

					localDB.setItem('sended_randoms', this.sended_randoms, ()=>{
						callback(r, d)
					})

					return
				}
			})
		})
	}

}

export default new Games()

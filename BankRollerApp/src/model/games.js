import $          from 'jquery'
import _config    from 'app.config'
import Eth        from 'Eth/Eth'
import localDB    from 'localforage'

import * as Utils from 'utils'


import {AsyncPriorityQueue, AsyncTask} from 'async-priority-queue'

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
		Eth.deployContract(_config.contracts[name].bytecode, (address)=>{
			this.add(address, callback)

			// add bets to contract
			fetch( _config.api_url+'?a=faucet&network='+_config.network+'&to='+address ).then( response => {
				return response.text()
			}).then( result => {
				console.groupCollapsed('Add bets to '+address+' result:')
				console.log(result)
				console.groupEnd()

			})

			callback(address)
		})
	}


	add(contract_id, callback){
		console.groupCollapsed('[Games] add ' + contract_id)

		this._games[contract_id] = {}

		localDB.setItem('Games', this._games)

		console.log('Get game balance')
		Eth.getBetsBalance(contract_id, (balance)=>{

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

	runUpdateBalance(){
		this.get(games => {
			for(let contract_id in games){
				Eth.getBetsBalance(contract_id, (balance)=>{
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

			this.get(games => {
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
		Eth.RPC.request('blockNumber').then( response => {
			if (!response || !response.result) { return }
			this.curBlock = response.result
		}).catch( err => {
			console.error('getCurBlock error:', err)
		})
	}

	getLogs(address, callback){
		console.log('curBlock:', this.curBlock)

		fetch(_config.api_url+'proxy.php?a=unconfirmed&address='+address).then(r=>{ return r.json() }).then(seeds=>{
			console.info('unconfirmed from server:'+seeds)
			if (seeds && seeds.length) {
				seeds.forEach( seed => {
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
		Eth.RPC.request('getLogs',[{
			'address':   address,
			'fromBlock': this.curBlock,
			'toBlock':   'latest',
		}]).then( response => {
			if(!response.result){ callback(null); return }

			for (let i = 0; i < response.result.length; i++) {
				let obj = response.result[i]

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

			callback(response.result)
			return
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
			result => {
				if (callback) callback(result)
			},
			// Ошибка
			e => {
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

		// id 0
		Eth.RPC.request('call', [{
			'to':   address,
			'data': '0xa7222dcd'+seed.substr(2)
		}, 'pending']).then( response => {

			console.log('>> Pending response:', response)

			if (!response.result || response.result.split('0').join('').length < 5) {
				this.seeds_list[seed].pending = false
				return
			}

			this.seeds_list[seed].pending = true
			delete( this.pendings[address+'_'+seed] )
			callback()
		})
	}

	sendRandom2Server(address, seed){
		if (this.seeds_list[seed] && this.seeds_list[seed].confirm_sended_server) {
			return
		}

		// this.checkPending(address, seed, ()=>{
		Eth.Wallet.getConfirmNumber(seed, address, _config.contracts.dice.abi, (confirm, PwDerivedKey)=>{
			$.get(_config.api_url+'proxy.php?a=confirm', {
				vconcat: seed,
				result:  confirm
			}, ()=>{
				this.seeds_list[seed].confirm_server_time   = new Date().getTime()
				this.seeds_list[seed].confirm               = confirm
				this.seeds_list[seed].confirm_server        = confirm
				this.seeds_list[seed].confirm_sended_server = true

				localDB.setItem('seeds_list', this.seeds_list)
			})
		})
		// })
	}

	sendRandom(address, seed, callback){
		if (this.seeds_list[seed] && this.seeds_list[seed].confirm_sended_blockchain) {
			return
		}

		Eth.Wallet.getSignedTx(seed, address, _config.contracts.dice.abi, (signedTx, confirm)=>{

			$.get('https://platform.dao.casino/api/proxy.php?a=confirm', {
				vconcat: seed,
				result:  confirm
			})

			console.log('getSignedTx result:', seed, confirm)

			// id 0
			Eth.RPC.request('sendRawTransaction', ['0x'+signedTx]).then( response => {
				this.seeds_list[seed].confirm_blockchain_time   = new Date().getTime()
				this.seeds_list[seed].confirm_sended_blockchain = true
				this.seeds_list[seed].confirm                   = confirm
				this.seeds_list[seed].confirm_blockchain        = confirm

				localDB.setItem('seeds_list', this.seeds_list, ()=>{
					callback(!!response.result, response)
				})
			}).catch( err => {
				console.error('sendRawTransaction error:', err)
			})

		})
	}

}

export default new Games()

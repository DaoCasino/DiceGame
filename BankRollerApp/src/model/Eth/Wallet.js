import $         from 'jquery'
import _config   from 'app.config'
import localDB   from 'localforage'
import ethWallet from 'eth-lightwallet'
import ethABI    from 'ethereumjs-abi'
import bigInt    from 'big-integer'

import * as Utils from 'utils'

let _wallet = {}

export default class Wallet {
	constructor() {
		// Create wallet if not exist
		localDB.getItem('wallet', (err, wallet)=>{
			console.info(wallet)
			if (wallet) {
				_wallet = wallet
			} else {
				this.create()
			}
		})
	}

	get(){
		return _wallet
	}

	getKs(){
		if (this.keyStore) {
			return this.keyStore
		}
		this.keyStore = ethWallet.keystore.deserialize( _wallet.keystorage  )
		return this.keyStore
	}

	exportPrivateKey(callback){
		this.getPwDerivedKey( PwDerivedKey => {
			let private_key = this.getKs().exportPrivateKey(_wallet.addr, PwDerivedKey)

			callback(private_key)
		})
	}


	getPwDerivedKey(callback, limit=5){
		if (this.pwDerivedKey) {
			callback(this.pwDerivedKey)
			return
		}
		this.getKs().keyFromPassword(_config.wallet_pass, (err, pwDerivedKey)=>{
			if (err && limit>0 ) { this.getPwDerivedKey(callback, (limit-1)); return }

			if (pwDerivedKey) {
				this.pwDerivedKey = pwDerivedKey
			}
			callback(pwDerivedKey)
		})
	}


	reset(){
		localDB.setItem('wallet', null)
	}
	create(){
		console.log('Create Wallet')

		let wallet = {}

		ethWallet.keystore.createVault({
			seedPhrase: ethWallet.keystore.generateRandomSeed(),
			password:   _config.wallet_pass
		}, (err, ks)=>{
			if (err) console.error('[Create Wallet] Error: ', err)

			ks.keyFromPassword(_config.wallet_pass, (err, pwDerivedKey)=>{
				if (err) console.error('[Create Wallet] keyFromPassword Error: ', err)

				ks.generateNewAddress(pwDerivedKey, 1)

				wallet.addr         = ks.getAddresses()[0]
				wallet.keystorage   = ks.serialize()
				wallet.openkey      = '0x' + wallet.addr


				console.info('Wallet created!', wallet)

				this.addCoins(wallet.openkey)

				localDB.setItem('wallet', wallet)

				_wallet = wallet

				return
			})
		})
	}

	addCoins(wallet_openkey){
		console.log('Add coins to wallet', wallet_openkey)
		fetch( _config.api_url+'?a=faucet&network='+_config.network+'&to='+wallet_openkey ).then( response => {
			return response.text()
		}).then( result => {
			console.groupCollapsed('Add coins result:')
			console.log(result)
			console.groupEnd()
		})
	}


	getNonce(callback){
		if (this.nonce) {
			this.nonce++
			callback('0x'+Utils.numToHex(this.nonce))
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
				'method': 'eth_getTransactionCount',
				'params': [ this.get().openkey, 'pending']
			}),
			success: d => {
				this.nonce = Utils.hexToNum(d.result.substr(2))

				console.log('nonce:', d.result)
				callback( d.result )
			}
		})
	}


	getConfirmNumber(seed, address, abi, callback){
		this.getPwDerivedKey( PwDerivedKey => {
			let VRS = ethWallet.signing.signMsg(
				this.getKs(),
				PwDerivedKey,
				seed,
				_wallet.openkey.substr(2)
			)

			let signature = ethWallet.signing.concatSig(VRS)


			let v = VRS.v
			let r = signature.slice(0, 66)
			let s = '0x' + signature.slice(66, 130)

			/* Equivalent of solidity hash function:
				function confirm(bytes32 _s) public returns(uint256){
					return uint256 (sha3(_s));
				}
			*/
			let hash    = '0x'+ethABI.soliditySHA3(['bytes32'],[ s ]).toString('hex')
			let confirm = bigInt(hash,16).divmod(65536).remainder.value

			callback(confirm, PwDerivedKey, v,r,s)
		})
	}

	signTx(options, callback){
		this.getPwDerivedKey( PwDerivedKey => {
			this.getNonce( nonce => {
				options.nonce = nonce

				let signedTx = ethWallet.signing.signTx(
					this.getKs(),
					PwDerivedKey,
					ethWallet.txutils.createContractTx(_wallet.openkey.substr(2), options).tx,
					_wallet.openkey.substr(2)
				)

				callback(signedTx)
			})
		})
	}

	getSignedTx(seed, address, abi, callback){
		this.getConfirmNumber(seed, address, abi, (confirm, PwDerivedKey, v,r,s)=>{
			this.getNonce( nonce => {
				console.log('nonce', nonce)
				let options = {
					to:       address,
					nonce:    nonce,
					gasPrice: '0x737be7600',
					gasLimit: '0x927c0',
					value:    0,
				}

				let registerTx = ethWallet.txutils.functionTx(
									abi,
									'confirm',
									[seed, v, r, s],
									options
								)

				let signedTx = ethWallet.signing.signTx(
									this.getKs(),
									PwDerivedKey,
									registerTx,
									_wallet.openkey.substr(2)
								)

				callback(signedTx, confirm)
			})
		})
	}
}




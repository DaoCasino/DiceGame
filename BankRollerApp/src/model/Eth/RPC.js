/*
 * Wrapper for JSON-RPC Ethereum API
 * https://github.com/ethereum/wiki/wiki/JSON-RPC
 *
 * Example usage:
 *    ETH.request('sendRawTransaction', [params]).then( response => {
 *	     ...
 *    }).catch(err => { consle.error(err) })
 *
 **/

import $ from 'jquery'

export default class ethRPC {
	constructor(provider_url){
		this.provider_url = provider_url
	}

	request(method_name=false, params=[], id=1){
		return new Promise((resolve, reject) => {
			try	{
				let res = this.callMethod(method_name, params, id, (response)=>{
					if (response) {
						resolve( response )
					} else {
						reject( response )
					}
				})
				if (res===false) {
					reject( 'empty method' )
				}
			} catch(e){
				reject(e)
			}
		})
	}

	callMethod(method_name=false, params=[], id=1, callback=false){
		if (!method_name) {
			return false
		}

		$.ajax({
			type:     'POST',
			url:      this.provider_url,
			dataType: 'json',
			async:    false,

			data: JSON.stringify({
				'id': 1,
				'jsonrpc': '2.0',
				'method': 'eth_'+method_name,
				'params': params
			}),
			success: callback,
			error:   callback,
		})
	}
}


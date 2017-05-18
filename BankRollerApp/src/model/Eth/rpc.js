/*
 * Wrapper for JSON-RPC Ethereum API
 * https://github.com/ethereum/wiki/wiki/JSON-RPC
 **/

import $ from 'jquery'
import _config from 'app.config.js'

class ethRPC {
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
				'method': 'eth__'+method_name,
				'params': params
			}),
			success: callback,
			error:   callback,
		})
	}
}

export default new ethRPC(_config.HttpProviders.infura.url)

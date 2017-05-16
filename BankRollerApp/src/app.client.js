import $       from 'jquery'
import _config from './app.config.js'
import Wallet  from './modules/wallet.js'
import Games   from './modules/games.js'
import View    from './modules/view.js'

document.addEventListener('DOMContentLoaded',()=>{
	window.App = {}
	window.App.Games = Games

	// Get games contracts
	console.group('Get games')

	Games.get((games)=>{
		console.log(games)

		View.renderGamesList(games)
		View.loading(false)

		console.groupEnd()
	})

	// Add new game contract
	View.onGameAdd((contract_id)=>{
		console.log('Add game')

		View.loading(true)

		Games.add(contract_id, (info)=>{
			console.info('Game added', info)
			View.loading(false)

			Games.get((games)=>{
				View.renderGamesList(games)
			})
		})
	})


	setTimeout(()=>{
		// Games.deployContract('dice', (res)=>{
			// console.log(res)
		// })
	}, 1000)

	View.transactionsUpdate()

	setTimeout(()=>{
		$('body').append('<div id="waddr">Your wallet: <a href="https://'+_config.network+'.etherscan.io/address/'+Wallet.get().openkey+'" target="_blank">'+Wallet.get().openkey+'</a></div>')

		Games.runUpdateBalance()
	}, 1000)

})


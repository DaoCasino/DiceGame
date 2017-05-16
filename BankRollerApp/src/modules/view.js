import $ from 'jquery'
import _config from '../app.config.js'
import localDB from 'localforage'

class View {
	constructor() {
		this.$content = $('#content')
	}

	loading(load){
		this.$content.removeClass('loading')
		if (load) {
			this.$content.addClass('loading')
		}
	}

	onGameAdd(callback){
		let $input = $('#contract_id')

		$('#add_game_form').on('submit', (e)=>{
			e.preventDefault()

			let contract_id = $input.val()

			$input.val('')

			callback(contract_id)
		})
	}

	renderGamesList(games){
		if (!games || !Object.keys(games).length) {
			$('table#games').hide()
			$('table#games tbody').html('')
			return
		}

		let games_html = ''
		for(let contract_id in games){
			let game     = games[contract_id]
			let bankroll = game.start_balance
			let profit   = (+game.balance - +game.start_balance).toFixed(4)

			// TODO: delta +30-205
			if (profit>0) {
				profit = '<span style="color:green">'+profit+' bet</span>'
			} else {
				profit = '<span style="color:red">'+profit+' bet</span>'
			}

			games_html += `<tr>
				<td>
					<a  class="address"
						target="_blank" rel="noopener"
						title="${contract_id}"
						href="https://${_config.network}.etherscan.io/address/${contract_id}">
							${contract_id}
					</a>
				</td>
				<td>${bankroll}</td>
				<td class="profit">${profit}</td>
				<td>
					<a data-id="${contract_id}" href="#delete">remove</a>
				</td>
			</tr> `
			// <span>stop</span> <a href="#get_money">refund</a>
		}

		if (games_html) {
			$('table#games').show()
			$('table#games tbody').html(games_html)

			$('table#games tbody a[href="#delete"]').on('click',function(){
				if (confirm('Shure?')) {
					App.Games.remove( $(this).attr('data-id') )
					$(this).parent().parent().remove()
				}
			})
		}
	}

	transactionsUpdate(){
		setInterval(()=>{
			localDB.getItem('seeds_list', (err,seeds_list)=>{
				if (seeds_list) {
					this.renderTXs(seeds_list)
				}
			})
		}, 5000)
	}

	renderTXs(seeds){
		let html = ''
		for(let seed in seeds){
			let info = seeds[seed]

			let status = 'wait'
			if (info.confirm_sended_server) {
				status = 'on server'
			}
			if (info.confirm_sended_blockchain) {
				status = 'on blockchain'
			}

			html += `<tr>
				<td class="seed">
				<a  class="address"
					target="_blank" rel="noopener"
					title="${seed}"
					href="https://${_config.network}.etherscan.io/tx/${seed}">
						${seed}
				</a>
				</td>
				<td class="status">
					${status}
				</td>
				<td class="confirm">
					<span title="Server:${info.confirm_server} blockchain:${info.confirm_blockchain}">${info.confirm}</span>
				</td>
			</tr>`
		}

		html = `<table class="seeds">
			<thead>
				<tr>
					<th>TX</th>
					<th>status</th>
					<th>random</th>
				</tr>
			</thead>
			<tbody>
				${html}
			</tbody>
		</table>`

		$('#content table.seeds').remove()
		$('#content').append(html)
	}


}


export default new View()

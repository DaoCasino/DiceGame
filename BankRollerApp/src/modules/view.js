import $ from 'jquery'

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
					<a  target="_blank"
						rel="noopener"
						href="https://ropsten.etherscan.io/address/${contract_id}">
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
}


export default new View()

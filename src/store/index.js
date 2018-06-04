import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  namespaced: true,
  state: {
    balance: {
      ethBalance         : '...',
      betBalance         : '...',
      player_balance     : 0,
      bankroller_balance : 0
    },
    game: {
      amount: 0,
      deposit: 0,
      maxAmount: 0,
      totalAmount: 0
    },
    paid: {
      num     : 32767,
      payout  : 0,
      prevNum : 0,
      percent : 50
    },
    address: {
      player     : '...',
      bankroller : '...'
    },
    tx                 : '',
    flag               : true,
    start              : '...',
    errorText          : '',
    info_table         : [],
    paychannelContract : ''
  },
  mutations: {
    updateTx                 (state, value) { state.tx = value },
    updateNum                (state, value) { state.paid.num = value },
    updateError              (state, value) { state.errorText = value },
    updateStart              (state, value) { state.start = value },
    updateAmount             (state, value) { state.game.amount = value },
    updateDeposit            (state, value) { state.game.deposit = value },
    updateInfoTable          (state, value) { state.info_table.push(value) },
    updateEthBalance         (state, value) { state.balance.ethBalance = value },
    updateBetBalance         (state, value) { state.balance.betBalance = value },
    updatePlayerBalance      (state, value) { state.balance.player_balance = value },
    updatePlayerAddress      (state, value) { state.address.player = value },
    updateBankrollBalance    (state, value) { state.balance.bankroller_balance = value },
    updateBankrollAddress    (state, value) { state.address.bankroller = value },
    updatePaychannelContract (state, value) { state.paychannelContract = `https://${process.env.DC_NETWORK}.etherscan.io/address/${value}` },

    updateMaxAmount (state) {
      for (let i = state.game.amount; i <= state.balance.player_balance; i = Number(Math.round((i + 0.1) + 'e' + 1) + 'e-' + 1)) {
        const payout = (i * (65535 - 65535 * 0.02) / state.paid.num) - i

        if (i === state.balance.player_balance) {
          state.game.maxAmount = state.balance.player_balance
          return
        }

        if (payout >= state.balance.bankroller_balance) {
          state.game.maxAmount = Number(Math.round((i - 0.1) + 'e' + 1) + 'e-' + 1)
          return
        }
      }
    },

    updateTotalAmount (state, value) {
      let newValue = state.game.totalAmount += value
      state.game.totalAmount = newValue
    },

    updatePercent (state, value) {
      let percent = 100 / (65535 / value)
      if (percent < 1.0) percent = 1.0
      if (state.paid.payout >= state.balance.bankroller_balance) return
      state.paid.percent = percent.toFixed(1)
    },

    updatePayout (state, value = 32356) {
      const MAX_NUM = 65535
      const userBet = state.game.amount
      let   payout  = (userBet * (MAX_NUM - MAX_NUM * 0.02) / value) - userBet

      if (payout < 0.00) payout = 0.00

      state.paid.payout = Number(payout)
    }
  }
})

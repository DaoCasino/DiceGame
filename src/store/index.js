import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  namespaced: true,
  state: {
    balance: {
      start              : '...',
      amount             : 0,
      deposit            : 0,
      ethBalance         : '...',
      betBalance         : '...',
      totalAmount        : 0,
      player_balance     : 0,
      bankroller_balance : 0
    },
    paid: {
      num     : 32767,
      payout  : 0,
      percent : 50
    },
    address: {
      player     : '...',
      bankroller : '...'
    },
    tx         : '',
    flag       : true,
    errorText  : '',
    info_table : [],
    paychannelContract: ''
  },
  mutations: {
    updateTx                 (state, value) { state.tx = value },
    updateNum                (state, value) { state.paid.num = value },
    updateError              (state, value) { state.errorText = value },
    updateStart              (state, value) { state.balance.start = value },
    updateAmount             (state, value) { state.balance.amount = value },
    updateBalance            (state, value) { state.balance.deposit = value },
    updateInfoTable          (state, value) { state.info_table.push(value) },
    updateEthBalance         (state, value) { state.balance.ethBalance = value },
    updateBetBalance         (state, value) { state.balance.betBalance = value },
    updatePlayerBalance      (state, value) { state.balance.player_balance = value },
    updatePlayerAddress      (state, value) { state.address.player = value },
    updateBankrollBalance    (state, value) { state.balance.bankroller_balance = value },
    updateBankrollAddress    (state, value) { state.address.bankroller = value },
    updatePaychannelContract (state, value) { state.paychannelContract = `https://${process.env.DC_NETWORK}.etherscan.io/address/${value}` },

    updateTotalAmount (state, value) {
      let newValue = state.balance.totalAmount += Number(value)
      state.balance.totalAmount = Number(newValue.toFixed(1))
    },

    updatePercent (state, value) {
      let percent = 100 / (65535 / value)
      if (percent < 1.0) percent = 1.0
      if (state.paid.payout >= state.balance.bankroller_balance) return
      state.paid.percent = percent.toFixed(1)
    },

    updatePayout (state, value) {
      const MAX_NUM = 65535
      let userBet = state.balance.amount
      if (value === undefined) value = 32356

      let payout  = (userBet * (MAX_NUM - MAX_NUM * 0.02) / value) - userBet

      if (payout < 0.00) payout = 0.00
      if (payout >= state.balance.bankroller_balance) {
        payout = state.balance.bankroller_balance
      }
      state.paid.payout = payout
    }
  }
})
